const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

// create apollo server...
const server = new ApolloServer({
	typeDefs,
	resolvers
});
// and the express server
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// start up the apollo server
const startApolloServer = async (typeDefs, resolvers) => {
	await server.start();

	// make the express server its middleware
	server.applyMiddleware({ app });
};

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(
            `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
        );
    });
});

// call
startApolloServer(typeDefs, resolvers);
