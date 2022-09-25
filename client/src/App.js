import React from 'react';
import {ApolloProvider, ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
// apolloprovider gives data to other components
// apolloclient is a constructor that will help connect us to the graphql api
// inmemorycache caches response data for efficiency
// createhttplink controls how apollo client makes requests - its middleware, or like it
import {setContext} from '@apollo/client/link/context';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';

// proxy property in package.json means we can use a relative path
const httpLink = createHttpLink({
    uri: '/graphql'
});

// middleware function
// adding an authorization property to the headers of each request, including the token if there is one
// note that setContext takes a function as its argument
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});

// instantiate apollo instance w/ cache
const client = new ApolloClient({
    // combining the authLink and httpLink
    // not totally sure how this works
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
        <Router>
            <div className='flex-column justify-flex-start min-100-vh'>
                <Header />

                <div className='container'>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        <Route path="/login" element={<Login />} />

                        <Route path="/signup" element={<Signup />} />

                        <Route path="/profile">
                            <Route path=":username" element={<Profile />} />

                            <Route path="" element={<Profile />} />
                            {/* this one is for viewing your own profile */}
                        </Route>

                        <Route path="/thought/:id" element={<SingleThought />} />

                        <Route path="*" element={<NoMatch />} />
                    </Routes>
                </div>

                <Footer />
            </div>             
        </Router>
    </ApolloProvider>
  );
}
// apolloprovider wrapper feeds the client info into everything
// router makes everything within it cooperate with the routes

export default App;
