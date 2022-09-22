const {User, Thought} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');

// akin to a controller, huh? a bunch of methods bundled together...

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({})
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
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            // using signToken from the utils to generate a JWT that will then be returned with the user data

            return {token, user};
        },

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
        }
    }
};

module.exports = resolvers;