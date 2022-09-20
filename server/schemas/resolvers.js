const resolvers = {
    Query: {
        helloWorld: () => 'Hello world!'
    }
};
// Query.helloWorld will resolve the Query property named 'helloWorld'

module.exports = resolvers;