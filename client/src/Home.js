import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
function Home({ user, logout }) {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Ciao, {user.name}!</h1>
            <button className="btn btn-primary" onClick={()=>navigate("/Note")}>Note</button>
            <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
    );
}

export default Home;