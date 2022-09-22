import React from 'react';
import {ApolloProvider, ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
// apolloprovider gives data to other components
// apolloclient is a constructor that will help connect us to the graphql api
// inmemorycache caches response data for efficiency
// createhttplink controls how apollo client makes requests - its middleware, or like it

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

// connecting the frontend to the graphql thingy
// absolute link bc react runs on localhost:3000
const httpLink = createHttpLink({
    uri: 'http://localhost:3001/graphql'
});

// instantiate apollo instance w/ cache
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
        <div className='flex-column justify-flex-start min-100-vh'>
            <Header />

            <div className='container'>
                <Home />
            </div>

            <Footer />
        </div>        
    </ApolloProvider>
  );
}

export default App;
