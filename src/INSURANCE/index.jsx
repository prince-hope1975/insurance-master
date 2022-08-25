import React, { useState } from "react";
import { ReactDOM } from "react";
import MobileNavigation from "./MobileNavigation";
import Navigation from "./Navigation";
import "./index.css";
import homepic from "./homepic.svg";
import aboutpic from "./aboutpic.svg";

export function fetchLocalStorage() {
  const str = window?.localStorage?.getItem("subscribed");
  const store = JSON.parse(str);
  if (!str || str?.length == 0) {
    return [];
  } else {
    console.log({store})
    return [...store];
  }
}
export function setLoaclStorage(str = []) {
  const storrageItem = str.length <= 0 ? str : fetchLocalStorage();
  window.localStorage.setItem("subscribed", JSON.stringify(storrageItem));
}

import { useDefaultContext } from "../context";

const Dapp = () => {
  const [storage, setStorage] = React.useState([]);
  const {
    connectWallet,
    isOpen,
    isConnected,
    setOpen,
    modalMessage,
    DisconnectWallet,
    createAsyncTimeout,
    showModal,
    displayMessage,
    Api,
  } = useDefaultContext();

  async function handleClick() {
    try {
      !isConnected ? await connectWallet() : DisconnectWallet();
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    // setLoaclStorage()
    const str = fetchLocalStorage();
    setStorage(str ?? []);
    console.log(str);
  }, []);
  const ConnectWalletButton = () => {
    if (!isConnected) {
      return (
        <div onClick={handleClick} className="connect">
          Connect Wallet
        </div>
      );
    }
    return (
      <div onClick={handleClick} className="connect">
        Disconnect
      </div>
    );
  };
  const Modal = ({ children }) => {
    return (
      <div className="modal_bg">
        <div className="modal">
          <div className="x" onClick={() => displayMessage(false)}>
            x
          </div>
          {!modalMessage && "Something happened"}
          {modalMessage}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {showModal && <Modal />}
      <div className="Navbar">
        <h1>
          AUTO<span className="insure">[INSURE]</span>
          <ConnectWalletButton />
        </h1>
        <MobileNavigation></MobileNavigation>
        <Navigation></Navigation>
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
        {data.map((props, index) => {
          return (
            <Card
              index={index}
              storage={storage}
              ConnectWalletButton={ConnectWalletButton}
              key={index}
              {...props}
            />
          );
        })}
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
};

const data = [
  {
    head: "Regular",
    range: "1-2 cars",
    info1: "Burgulary/Theft",
    info2: "Automobile Damage",
    info3: "Accidental And External Damage",
    price: 1,
  },
  {
    head: "Gold",
    range: "3-6 cars",
    info1: "Burgulary/Theft",
    info2: "Fire and Exploxion",
    info3: "Accidental And External Damage",
    price: 2.8,
  },
  {
    head: "Platinum",
    range: "7-14 cars",
    info1: "Burgulary/Theft",
    info2: "Fire And Explosion",
    info3: "Accidental And External Damage",
    price: 5,
  },
];

const Card = ({
  head,
  range,
  info1,
  info2,
  info3,
  price,
  index,
  storage,
  ConnectWalletButton,
}) => {
  const { isConnected, Api, createAsyncTimeout, displayMessage } =
    useDefaultContext();
  const handleStartPlan = async (fund) => {
    try {
      if (isConnected) {
        displayMessage(true, "Beginning Subscription");
        await Api.Subscribe(fund);
        displayMessage(true, "You just subscribed");
        const db = fetchLocalStorage();
        setLoaclStorage([...db, index]);
      } else {
        displayMessage(
          true,
          <>
            <div>You aren't connected </div>
            <ConnectWalletButton />
          </>
        );
        await createAsyncTimeout(6);
        displayMessage(false);
      }
    } catch (error) {
      displayMessage(true, "An error occured");
      await createAsyncTimeout(2);
      displayMessage(false);
    }
  };
  const handleClaimPlan = async (claim, fund) => {
    try {
      if (isConnected) {
        displayMessage(true, "Starting Claim");
        await Api.Submit_claim(claim, fund);
        displayMessage(true, "Successfully claimed");
      } else {
        displayMessage(
          true,
          <>
            <div>You aren't connected </div>
            <ConnectWalletButton />
          </>
        );
        await createAsyncTimeout(6);
        displayMessage(false);
      }
    } catch (error) {}
  };
  const getClaim = (price) => {
    displayMessage(true, <Elem price={price} />);
  };
  const Elem = ({ price }) => {
    const [claim, setClaim] = useState();
    return (
      <div>
        <input
          onChange={(e) => setClaim(e.target.value)}
          type="text"
          placeholder="Input the claim"
        />
        <p>You are about to claim ${price}</p>
        {/* <input type="text" placeholder="Input claim Amount" /> */}
        <button onClick={() => handleClaimPlan(claim, price)}>Claim</button>
      </div>
    );
  };
  return (
    <div className="card">
      <h1>{head}</h1>
      <p className="cash">${price}</p>
      <div className="objectives">
        <p>{range}</p>
        <hr></hr>
        <p>{info1}</p>
        <hr></hr>
        <p>{info2}</p>
        <hr></hr>
        <p>{info3}</p>
      </div>
      {!storage?.includes(index) ? (
        <div className="cards-btn" onClick={() => handleStartPlan(price)}>
          Start Plan
        </div>
      ) : (
        <div className="cards-btn" onClick={() => getClaim(price)}>
          Make Claim
        </div>
      )}
    </div>
  );
};

export default Dapp;
