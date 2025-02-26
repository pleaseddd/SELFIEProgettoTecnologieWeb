import { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function App() {
  useEffect(() => {
    const bootstrap = require('bootstrap');
    new bootstrap.Carousel(document.getElementById('carouselExampleSlidesOnly'), {
      interval: 5000, 
      ride: 'carousel'
    });
  }, []);
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100"></div>
        <div className="col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
          <div className="card p-4 shadow-lg">
            <h2 className="text-center mb-4">Login</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" placeholder="Email" />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" />
              </div>
              <button type="submit" className="btn btn-primary w-100">Accedi</button>
            </form>
          </div>
        </div>
        
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="container">
            <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner" >
                <div className="carousel-item active ">
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
    
  );
}

export default App;
