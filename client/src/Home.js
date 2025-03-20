import React from 'react';

function Home({ user }) {
    return (
        <div>
	        <h1>Home</h1>
            <h1>Ciao, {user.name}!</h1>
        </div>
    );
}

export default Home;
