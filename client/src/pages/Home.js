import React from 'react';
import ThoughtList from '../components/ThoughtList';

import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';

const Home = () => {
	// make queries
	const { loading, data } = useQuery(QUERY_THOUGHTS);

	// if data exists, put data.thoughts in here, otherwise empty array
	const thoughts = data?.thoughts || [];
	console.log(thoughts);

	return (
		<main>
			<div className="flex-row justify-space-between">
				<div className="col-12 mb-3">
					{loading ? (
						<div>Loading...</div>
					) : (
						<ThoughtList
							thoughts={thoughts}
							title="Some feed for thought(s)..."
						/>
					)}
				</div>
			</div>
		</main>
	);
};

export default Home;
