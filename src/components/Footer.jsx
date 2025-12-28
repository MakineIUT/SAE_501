import React from "react";
import { Link } from "react-router-dom";
import logotritech from "../assets/logotritech.jpg";


function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        padding: "60px 0",
        // marginTop: "200px",
      }}
    >
      <div className="container">
        <div className="row text-start">

          {/* LOGO */}
          <div className="col-md-3 mb-4">
                      <div
                        className="bg-grey rounded-circle d-flex align-items-center justify-content-center"
                        onClick={() => handleNavigation("accueil")}
              style={{
                width: "250px",
                height: "250px",
                backgroundColor: "#f8f9fa",
                borderRadius: "50%", cursor: "pointer"}}>
              <img
                src={logotritech}
                alt="Logo"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "contain"}}/></div>
                      </div>

          {/* COMPANY */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">COMPANY</h6>
            <p className="mb-2">How it works</p>
            <p className="mb-2">Pricing</p>
            <p className="mb-0">Demo</p>
          </div>

          {/* RESOURCES */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">RESOURCES</h6>
            <p className="mb-2">Blog post name goes here</p>
            <p className="mb-2">Blog post name goes here</p>
            <p className="mb-2">Blog post name goes here</p>
            <p className="mb-0">See all resources</p>
          </div>

          {/* ABOUT */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">ABOUT</h6>
            <p className="mb-2">Terms & Conditions</p>
            <p className="mb-0">Privacy Policy</p>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-muted mt-4">
          <small>Copyright © 2022 Company name</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;