import React from 'react';
import { Link } from 'react-router-dom';

const ThoughtList = ({ thoughts, title }) => {
	if (!thoughts.length) {
		return <h3>Silence.</h3>;
	}

	return (
		<div>
			<h3>{title}</h3>

			{thoughts &&
				thoughts.map(thought => (
					<div key={thought._id} className="card mb-3">
						<p className="card-header">
							On {thought.createdAt},{' '}
							<Link
								to={`/profile/${thought.username}`}
								style={{ fontWeight: 700 }}
								className="text-light"
							>
								{thought.username}
							</Link> thought...
						</p>

						<div className="card-body">
							<p>{thought.thoughtText}</p>

							<p className="mb-0">
								Reactions: {thought.reactionCount} || <Link to={`/thought/${thought._id}`}>
                                    Click to{' '}
								    {thought.reactionCount ? 'see' : 'start'} the
								    discussion.
                                </Link>
							</p>
						</div>
					</div>
				))}
		</div>
	);
};

export default ThoughtList;
