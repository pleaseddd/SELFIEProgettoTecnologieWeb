import React from 'react';

function Home({ user }) {
    console.log(user);
    return (
        <div>
            <h1>Ciao, {user.name}!</h1>
        </div>
    );
}

export default Home;