import "./App.css";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import background from "./assets/bg.png";
import nftImage from "./assets/teqqies.png";
import StartMinting from "./components/StartMinting";
import InProgressMinting from "./components/InProgressMinting";
import CompletedMinting from "./components/CompletedMinting";
import {ethers} from 'ethers'
import abi from "./manual/abi.json"

// Step 1: Run the app

function App() {
  const [inProgress, setInProgress] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [supply, setSupply] = useState(0);
  const [hash, setHash] = useState();

  const mint = async () => {
    console.log("Minting!")
    const payload = {value: ethers.utils.parseEther("0.001")}
    const transaction = await contract.safeMint(payload)

    console.log("#HASH: ", transaction.hash)
    setHash(transaction.hash)
    // Step 6: Write the mint function
    //
    // Step 9: Set the variables for progress and completed
    setInProgress(true)
     await transaction.wait()
     setInProgress(false)
     setCompleted(true)
  };

  const getTotalSupply = async () => {
    // Step 5: Contract => getTotalSupply()
    const totalSupply = await contract.totalSupply();
    console.log("Total supply: ", totalSupply.toNumber())
    setSupply(totalSupply.toNumber());
  };

  useEffect(( ) => {
    if(contract){
      getTotalSupply()
    }

  },[contract])
  // Step 5: Contract => getTotalSupply()

  const connect = async () => {
      console.log(window.ethereum)
    if (typeof window.ethereum !== "undefined"){
      console.log("Metamask installed")

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      const walletAccount  = accounts[0];
      console.log("WaletAccount: ", walletAccount);
      setAccount(walletAccount);

      const contractAddress = "0x809Dab4C7c525a9c092f3e28D18319a572ba189C";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(walletAccount);

      let NFTContract = new ethers.Contract(contractAddress, abi, signer);
      console.log("📝Contract: ", NFTContract);
      setContract(NFTContract);

    }
    // Step 2: Connect wallet (check Metamask + accounts)
    // Step 4: Wire up contract (provider, signer, NFTContract)
  };

  const getState = () => {
    if (inProgress) {
      // Step 10: Pass in the transaction hash to InProgressMinting Component and check this component
      return <InProgressMinting  hash={hash}/>;
    }

    if (completed) {
      // Step 11: Check this component
      return <CompletedMinting />;
    }

    // Step 8: Pass mint as props
    return <StartMinting mint={mint}/>;
  };

  return (
    <div className="app">
      <Header />
      <div className="hero">
        <img src={background} alt="background" />
        <div className="overlay"></div>
        <div className="card">
          <div className="main">
            <div className="details-section">
              <div className="details-header">
                <h1> TeqNation's 1st NFT Collection:</h1>
              </div>
              <div className="details-description">
                <h1>Teqqies</h1>
              </div>
              <div className="details-actions">
                <p> {supply} / 18 minted </p>
                {/* // Step 3: Render a mint button conditionally */}
                {/* // Step 7: insert getState() */}
                { account ?
                    getState()
                    : (
                <div className="button connect" onClick={connect}>
                  Connect Wallet
                </div>)}
              </div>
            </div>
            <div className="nft-section">
              <img className="nft-image" src={nftImage} alt="image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
