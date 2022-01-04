import axios from "axios";

require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const {createAlchemyWeb3} = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json').abi;
export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
              <p>
                {" "}
                  🦊{" "}
                  <a target="_blank" href={`https://metamask.io/download.html`}>
                  You must install Metamask, a virtual Ethereum wallet, in your
                  browser.
                </a>
              </p>
            </span>
            ),
        };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Let's Mint.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
              <p>
                {" "}
                  🦊{" "}
                  <a target="_blank" href={`https://metamask.io/download.html`}>
                  You must install Metamask, a virtual Ethereum wallet, in your
                  browser.
                </a>
              </p>
            </span>
            ),
        };
    }
};

export const mintNFT = async (url, name, description) => {

    const response = await axios('http://localhost:4000/api/database/getContract');
    const data = response.data.data;
    const id = response.data.id;
    const tokenURI = data.asset.url;
    const contractAddress = data.address;
    // const contractAddress = '0xc015a15a4e575FC49371213dF85B48cc80B4331d';
    // const tokenURI = 'https://gateway.pinata.cloud/ipfs/QmPVPEQzgrxLToKRS3HCTbKL1cR3bAZoYxVbZdmJDXryvQ';
    console.log(data);
    console.log(id);
    console.log(tokenURI);
    console.log(contractAddress);
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI()//make call to NFT smart contract
    };

    //sign the transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        await axios('http://localhost:4000/api/database/updateContractItem/' + id);
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/txs" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }

    }
}
