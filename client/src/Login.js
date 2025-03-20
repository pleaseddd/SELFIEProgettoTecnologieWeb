import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Signin from './components/Signin';
import Register from './components/Signup';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function Login({ setUser }) {
  const [login, setLogin] = useState([true]);
  useEffect(() => {
    const bootstrap = require('bootstrap');
    new bootstrap.Carousel(document.getElementById('carouselExampleSlidesOnly'), {
      interval: 5000,
      ride: 'carousel'
    });
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100">

       {login ? <Signin setUser={setUser} change={()=>setLogin(false)} /> : <Register change={()=>setLogin(true)} />}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="container">
            <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <h1>Prova 1</h1>
                </div>
                <div className="carousel-item">
                  <h1>Prova 2</h1>
                </div>
                <div className="carousel-item">
                  <h1>Prova 3</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
