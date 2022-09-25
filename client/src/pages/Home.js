import React from 'react';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import Auth from '../utils/auth';

const Home = () => {
	// make queries
	const { loading, data } = useQuery(QUERY_THOUGHTS);

	// if data exists, put data.thoughts in here, otherwise empty array
	const thoughts = data?.thoughts || [];

    const loggedIn = Auth.loggedIn();
    const {data: userData} = useQuery(QUERY_ME_BASIC);

	return (
		<main>
			<div className="flex-row justify-space-between">
				<div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
					{loading ? (
						<div>Loading...</div>
					) : (
						<ThoughtList
							thoughts={thoughts}
							title="Some feed for thought(s)..."
						/>
					)}
				</div>

                {loggedIn && userData ? (
                    <div className="col-12 col-lg-4 mb-3">
                        <FriendList
                            friendCount={userData.me.friendCount}
                            username={userData.me.username}
                            friends={userData.me.friends}
                        />
                    </div>
                ) : ( null )}
			</div>
		</main>
	);
};

export default Home;
