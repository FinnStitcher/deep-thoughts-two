import React, {useState} from 'react';

import {useMutation} from '@apollo/client';
import {ADD_THOUGHT} from '../../utils/mutations';
import {QUERY_THOUGHTS, QUERY_ME} from '../../utils/queries';

const ThoughtForm = () => {
    const [thoughtText, setThoughtText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    const [addThought, {error}] = useMutation(ADD_THOUGHT, {
        // update hook will, i think, run when addThought is run
        // here, addThought = the new thought, the value returned by calling the function
        update(cache, {data: {addThought}}) {
            // update this user's document
            // we cant be sure this user has made any posts, so we're using a try/catch so the page doesn't explode if me.thoughts doesn't exist
            try {
                const {me}  = cache.readQuery({ query: QUERY_ME });

                cache.writeQuery({
                    query: QUERY_ME,
                    data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
                });
            } catch (e) {
                console.warn('First thought by this user.');
            };

            // so now that we got through updating the user's page, we can update the global thought list
            // read cache
            const {thoughts} = cache.readQuery({query: QUERY_THOUGHTS});

            // make updated query, adding the new thought to the front
            cache.writeQuery({
                query: QUERY_THOUGHTS,
                data: {thoughts: [addThought, ...thoughts]}
            })
        }
    });

    const handleChange = (event) => {
        if (event.target.value.length <= 280) {
            setThoughtText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            await addThought({
                variables: {thoughtText}
            });
            // {thoughtText} = {thoughtText: thoughtText}

            setThoughtText('');
            setCharacterCount(0);
        } catch (e) {
            console.error(e);
        }
    };

    // if characterCount is 280 OR if there was an error, use the text-error class
    return (
        <div>
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className="ml-2">|| Something went wrong...</span>}
            </p>

            <form className="flex-row justify-center justify-space-between-md align-stretch" onSubmit={handleFormSubmit}>
                <textarea
                    placeholder="Here's a thought..."
                    className="form-input col-12 col-md-9"
                    value={thoughtText}
                    onChange={handleChange}
                ></textarea>

                <button className="btn col-12 col-md-3">Submit</button>
            </form>
        </div>
    )
};

export default ThoughtForm;