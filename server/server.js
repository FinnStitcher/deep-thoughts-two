const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

// create apollo server...
const server = new ApolloServer({
	typeDefs,
	resolvers,
    context: authMiddleware
    // every request coming into the server will go through authMiddleware, and the return value of that function will be available to all resolvers as the context param
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

// serve up frontend stuff from the build folder
// these will only run in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// any get requests will be sent the react frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

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
