import React from "react";
import { ReactDOM } from "react";
import MobileNavigation from "./MobileNavigation";
import Navigation from "./Navigation";
import "./index.css";
import homepic from "./homepic.svg";
import aboutpic from "./aboutpic.svg";

class Dapp extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "Hillary",
    };
  }
  render() {
    return (
      <div className="container">
        <div className="Navbar">
            <h1>
              AUTO<span className="insure">[INSURE]</span>
            </h1>
          <MobileNavigation></MobileNavigation>
          <Navigation>
          </Navigation>
        </div>
        <div className="home">
          <img src={homepic}></img>
          <div>
            <h1>We Are Always There For You</h1>
            <p>
              Lorem ipsum dolor sit amet. Et reiciendis rerum in labore
              consectetur et magnam eaque ut vero sint! Id porro incidunt est
              eaque quia et pariatur repellat est ipsum eius sit magnam eveniet.
            </p>
          </div>
        </div>
        <div className="about">
          <img src={aboutpic}></img>
          <div>
            <h1>About Us</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
              tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam, nisi ut aliquid ex ea commodi consequatur.
            </p>
          </div>
        </div>
        <div className="services">
          <h1>Our Services</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="plan-cards">
          <div className="card">
            <h1>Regular</h1>
            <p className="cash">$40</p>
            <div className="objectives">
              <p>1-2 Cars</p>
              <hr></hr>
              <p>Burglary/Theft</p>
              <hr></hr>
              <p>Automobile Damage</p>
              <hr></hr>
              <p>Accidental And External Damage</p>
            </div>
            <div className="cards-btn">Start Plan</div>
          </div>
          <div className="card">
            <h1>Gold</h1>
            <p className="cash">$80.99</p>
            <div className="objectives">
              <p>3-6 Cars</p>
              <hr></hr>
              <p>Burglary/Theft</p>
              <hr></hr>
              <p>Fire And Explosion</p>
              <hr></hr>
              <p>Accidental And External Damage</p>
            </div>
            <div className="cards-btn">Start Plan</div>
          </div>
          <div className="card">
            <h1>Platinum</h1>
            <p className="cash">$120</p>
            <div className="objectives">
              <p>7-14 Cars</p>
              <hr></hr>
              <p>Burglary/Theft</p>
              <hr></hr>
              <p>Fire And Explosion</p>
              <hr></hr>
              <p>Accidental And External Damage</p>
            </div>
            <div className="cards-btn">Start Plan</div>
          </div>
        </div>
        <div className="name-input">
          <input type="text" placeholder="Name" />
        </div>
        <div className="email-input">
          <input type="text" placeholder="Email" />
        </div>
        <div className="message-input">
          <input type="text" placeholder="Enter Message" />
          <div className="email-btn">Send Mail</div>
        </div>
      </div>
    );
  }
}
export default Dapp;
