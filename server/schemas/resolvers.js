const {User, Thought} = require('../models');

// akin to a controller, huh? a bunch of methods bundled together...

const resolvers = {
    Query: {
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
    }
};

module.exports = resolvers;