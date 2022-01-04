import { useEffect, useState } from "react";
import React from 'react';
import { connectWallet, getCurrentWalletConnected, mintNFT  } from "./utils/interact.js";
import axios from "axios";
const Minter = (props) => {

    //State variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [url, setURL] = useState("");

    useEffect(async () => { //TODO: implement
        const {address, status} = await getCurrentWalletConnected();
        setWallet(address)
        setStatus(status);

        addWalletListener();
    }, []);

    const connectWalletPressed = async () => { //TODO: implement
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };

    const onMintPressed = async () => { //TODO: implement
        const { status } = await mintNFT(url, name, description);
        setStatus(status);
    };
    const onTestPressed = async () => { //TODO: implement
            const data = await axios('http://localhost:4000/api/database/getContract');
    };

    return(
    <div className="Minter">
        <button id="walletButton" onClick={connectWalletPressed}>
          {walletAddress.length > 0 ? (
            "Connected: " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>

        <br></br>
        <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
        <button id="mintButton" onClick={onMintPressed}>
          Mint NFT
        </button>
        <p id="status">
          {status}
        </p>
      </div>
    );


    function addWalletListener() {
        if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setWallet(accounts[0]);
            setStatus("👆🏽 Write a message in the text-field above.");
          } else {
            setWallet("");
            setStatus("🦊 Connect to Metamask using the top right button.");
          }
        });
        } else {
        setStatus(
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        );
        }
    }
};

export default Minter;
