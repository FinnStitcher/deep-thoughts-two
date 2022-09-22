const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const expiration = '2h';

module.exports = {
    signToken: function({ username, email, _id }) {
        const payload = {username, email, _id};

        return jwt.sign({ data: payload }, secret, {expiresIn: expiration});
    },

    authMiddleware: function({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization;

        if (!token) {
            return req;
        }

        // if the token is coming in via headers, the word "bearer" will be appended; cutting that out
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        try {
            // decode the token, using the secret to make sure it's ours
            const {data} = jwt.verify(token, secret, {maxAge: expiration});

            // attaching the decoded data to the request's 'user' property
            req.user = data;
        } catch {
            console.log('Invalid token.');
        }
        // note that, with this setup, someone with an invalid token can still view thoughts

        return req;
        // this is middleware, so that return will shuttle the modified request on its way to the server
    }
}