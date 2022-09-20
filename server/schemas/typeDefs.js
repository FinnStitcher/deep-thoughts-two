const {gql} = require('apollo-server-express');
// import tagged template function

const typeDefs = gql`
    type Query {
        helloWorld: String
    }
`;
// type Query = defining a query
// naming individual queries and identifying what types of data should be returned
// scalars are data

module.export = typeDefs;