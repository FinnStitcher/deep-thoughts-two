const {gql} = require('apollo-server-express');
// import tagged template function

const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
}

type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
}

type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
}

type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
}

type Mutation {
    login(email: String!, password: String!): User
    addUser(username: String!, email: String!, password: String!): User
}
`;
// type Query = defining a query that will connect to a resolver
// type Thought = defining what a thought should look like
// naming individual queries and identifying what types of data should be returned
// the use of bangs here to require certain fields helps with data validation!

module.exports = typeDefs;