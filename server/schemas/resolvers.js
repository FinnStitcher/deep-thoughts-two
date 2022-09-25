const {User, Thought} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');

// akin to a controller, huh? a bunch of methods bundled together...

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const {username} = context.user;
                const userData = await User.findOne({username})
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');

                return userData;
            }

            throw new AuthenticationError('Not logged in.');
        },

        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
            // we can combine mongoose filters and graphql query definitions
        },

        user: async (parent, {username}) => {
            return User.findOne({username})
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts')
        },

        thoughts: async (parent, {username}) => {
            const params = username ? {username} : {};
            return Thought.find(params).sort({ createdAt: -1 });
        },
        // run find() on the Thought model
        // feed params into find(); if a username was provided, that will be a search filter

        thought: async (parent, {_id}) => {
            return Thought.findOne({_id});
        }
    },

    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError('Incorrect credentials.');
            }

            const correctPw = await user.isCorrectPassword(password);
            // i believe this is a bcrypt method

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials.');
            }
            // there need to be two if statements because, if no user was found, isCorrectPassword will be null and throw everything off
            
            const token = signToken(user);
            return {token, user};
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            // using signToken from the utils to generate a JWT that will then be returned with the user data

            return {token, user};
        },

        addThought: async (parent, args, context) => {
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: {thoughts: thought._id }},
                    { new: true }
                );

                return thought;
            }

            throw new AuthenticationError('You need to be logged in to publish thoughts.');
        },

        addReaction: async (parent, {thoughtId, reactionBody}, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    { $push: { reactions: {reactionBody, username: context.user.username} } },
                    {new: true, runValidators: true}
                );

                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in to publish reactions.');
        },

        addFriend: async (parent, {friendId}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {friends: friendId}},
                    {new: true}
                ).populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in to add friends.');
        }
    }
};

module.exports = resolvers;