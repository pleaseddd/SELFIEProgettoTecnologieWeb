import { useState } from 'react';
import Signin from './components/Signin';
import Register from './components/Signup';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style/login.css';

function Login({ setUser }) {
  const [login, setLogin] = useState(true);
  /*
  useEffect(() => {
    const bootstrap = require('bootstrap');
    new bootstrap.Carousel(document.getElementById('carouselExampleSlidesOnly'), {
      interval: 4069, 
      ride: 'carousel'
    });
  }, []);
*/
  return (
    <>
      <div className="background-container"></div>
      <div className="container vh-100">
        <div className="row h-100">
          <div className="col-md-4 d-flex justify-content-center align-items-center">
            {login ? (
              <Signin setUser={setUser} change={() => setLogin(false)} />
            ) : (
              <Register change={() => setLogin(true)} />
            )}
          </div>
          <div className="col-md-8 d-flex justify-content-center align-items-center">
            <div className="container">
              <div id="carouselExampleSlidesOnly" className="carousel slide w-100" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src="https://i.imgur.com/xbTjYJ8.jpeg" className="d-block w-100 carousel-img" alt="Immagine 1" />
                    <img src="https://i.imgur.com/xbTjYJ8.jpeg" className="d-block w-100 carousel-img" alt="Immagine 1" />
                  </div>
                  <div className="carousel-item">
                    <img src="https://i.imgur.com/cbei4dg.jpeg" className="d-block w-100 carousel-img" alt="Immagine 2" />
                    <img src="https://i.imgur.com/cbei4dg.jpeg" className="d-block w-100 carousel-img" alt="Immagine 2" />
                  </div>
                  <div className="carousel-item">
                    <img src="https://i.imgur.com/OmtG7wu.jpeg" className="d-block w-100 carousel-img" alt="Immagine 3" />
                    <img src="https://i.imgur.com/OmtG7wu.jpeg" className="d-block w-100 carousel-img" alt="Immagine 3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default Login;
