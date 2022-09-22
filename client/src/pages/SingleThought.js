import React from 'react';
import { useParams, Link } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';

import ReactionList from '../components/ReactionList';

const SingleThought = props => {
	const { id: thoughtId } = useParams();
	const { loading, data } = useQuery(QUERY_THOUGHT, {
		variables: { id: thoughtId }
	});
	// passing object in as the variable for the query

	const thought = data?.thought || {};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="card mb-3">
				<p className="card-header">
					On {thought.createdAt},{' '}
					<Link
						to={`/profile/${thought.username}`}
						style={{ fontWeight: 700 }}
						className="text-light"
					>
						{thought.username}
					</Link>{' '}
					thought...
				</p>
				<div className="card-body">
					<p>{thought.thoughtText}</p>
				</div>
			</div>
			{thought.reactionCount > 0 && (
				<ReactionList reactions={thought.reactions} />
			)}
		</div>
	);
};

export default SingleThought;
