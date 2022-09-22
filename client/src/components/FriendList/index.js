import React from 'react';
import {Link} from 'react-router-dom';

const FriendList = ({friendCount, username, friends}) => {
    if (!friends || !friends.length) {
        return <p className="bg-dark text-light p-3">{username}, go make some friends!</p>
    }

    return (
        <div>
            <h5>
                {username}'s {friendCount === 1 ? 'friend' : 'friends'}
            </h5>

            {friends.map(friend => (
                <button key={friend._id} className="btn w-100 display-block mb-2">
                    <Link to={`/profile/${friend.username}`}>
                        {friend.username}
                    </Link>
                </button>
            ))}
        </div>
    )
};

export default FriendList;