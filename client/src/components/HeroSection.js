import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <div className="">

          <header className="masthead d-flex align-items-center">
              <div className="container px-4 px-lg-5 text-center">
                  <h1 className="mb-1 headerst">creionez</h1>
                  <h3 className="mb-5">
                    <em>
                      Creionez este o aplicație creată special pentru studenții care <br />doresc să-și <b>organizeze mai bine notițele</b> și să colaboreze eficient.
                    </em>
                  </h3>
                  <Link className="btn btn-primary btn-xl" to="/auth">
                      Acceseaza Contul
                  </Link>
              </div>
          </header>

        </div>
    );
};

export default HeroSection;
