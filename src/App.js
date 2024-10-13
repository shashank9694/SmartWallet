import React, { useState } from "react";
import { ethers } from "ethers";
import { formatEther } from "ethers"; // Import formatEther directly
import { sendOTP, verifyOTP, googleLogin } from "./firebaseConfig";
import smartWalletAbi from "./SmartWalletAbi.json"; // The ABI of your deployed contract

const CONTRACT_ADDRESS = "0x8A1B6Db6179FB7ed9Ad85B7F68cA8A27ab337Ce6"; // Replace with your deployed contract address

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [otp, setOtp] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [smartWallet, setSmartWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpButton, setOtpButton] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [smartWalletBalance, setSmartWalletBalance] = useState(""); // Smart wallet contract balance

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum); // For ethers v6
        await web3Provider.send("eth_requestAccounts", []);
        const signer = await web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(signer);
        const address = await signer.getAddress();
        setWalletAddress(address);

        // Connect to the deployed SmartWallet contract
        const contract = new ethers.Contract(CONTRACT_ADDRESS, smartWalletAbi, signer);
        setSmartWallet(contract);

        // Get the balance of the user's wallet
        const balance = await web3Provider.getBalance(address);
        setBalance(formatEther(balance));

        // Get the balance of the smart wallet
        const smartWalletBal = await contract.getBalance();
        setSmartWalletBalance(formatEther(smartWalletBal));

        alert("Wallet connected successfully!");
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };
  const handleOtpButton = async () => {
try {
  if(otpButton){

    setOtpButton(false)
  }else{
    setOtpButton(true)
  }
} catch (error) {
  
}
  }

  const handleSendOTP = async () => {
    try {
      const result = await sendOTP(phoneNumber);
      setVerificationId(result.verificationId);
      setOtpSend(true)
    } catch (error) {
      console.error("OTP error:", error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(verificationId, otp);
      alert("Phone authenticated successfully!");
      setIsLoggedIn(true); // Set logged in state
      setOtpSend(false)

    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      alert("Logged in with Google!");
      setIsLoggedIn(true); // Set logged in state
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // Deposit Ether into the Smart Wallet contract
  const handleDeposit = async (amount) => {
    if (!signer) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Deposit successful!");

      // Update smart wallet balance after deposit
      const smartWalletBal = await smartWallet.getBalance();
      setSmartWalletBalance(formatEther(smartWalletBal));
    } catch (error) {
      console.error("Error depositing Ether:", error);
    }
  };

  // Transfer Ether from the Smart Wallet contract to an external wallet
  const handleTransfer = async () => {
    if (!signer || !smartWallet) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const tx = await smartWallet.transfer(transferAddress, ethers.parseEther(transferAmount));
      await tx.wait();
      alert("Transfer successful!");

      // Update smart wallet balance after transfer
      const smartWalletBal = await smartWallet.getBalance();
      setSmartWalletBalance(formatEther(smartWalletBal));
    } catch (error) {
      console.error("Error transferring Ether:", error);
    }
  };

  return (
    <div className="App" style={styles.container}>
      {/* Header with login options */}
      <header style={styles.header}>
        <h2>Smart Wallet Application</h2>
        {!isLoggedIn ? (
          <div>
            <button onClick={handleOtpButton}>Login with OTP</button>
            <button onClick={handleGoogleLogin}>Login with Google</button>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect MetaMask</button>
        )}
      </header>

      {/* OTP Inputs */}
      {otpButton && (
        <div style={styles.otpContainer}>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder=" eg: +91 80768xxxxx"
          />
          <button onClick={handleSendOTP}>Send OTP</button>
</div>
        )}

      {otpSend && (
        <div style={styles.otpContainer}>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP eg: 123456"
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      )}

      {/* Show wallet details, deposit, and transfer functionality if logged in and wallet is connected */}
      {isLoggedIn && smartWallet && (
        <div style={styles.detailsContainer}>
          <h3>Wallet Details</h3>
          <p>Wallet Address: {walletAddress}</p>
          <p>Balance: {balance} ETH</p>
          <p>Smart Wallet Balance: {smartWalletBalance} ETH</p>

          {/* Deposit Ether */}
          <h3>Deposit Ether to Smart Wallet</h3>
          <input
            type="text"
            placeholder="Amount in ETH"
            onChange={(e) => setTransferAmount(e.target.value)} // Reusing the state
          />
          <button onClick={() => handleDeposit(transferAmount)}>Deposit</button>

          {/* Transfer Ether */}
          <h3>Transfer Ether from Smart Wallet</h3>
          <input
            type="text"
            value={transferAddress}
            onChange={(e) => setTransferAddress(e.target.value)}
            placeholder="Recipient Address"
          />
          <input
            type="text"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Amount in ETH"
          />
          <button onClick={handleTransfer}>Transfer</button>
        </div>
      )}
    </div>
  );
}

// Styles for centering content
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
  },
  otpContainer: {
    marginTop: "20px",
  },
  detailsContainer: {
    marginTop: "20px",
    width: "300px", // Optional: set a width for details container
  },
};

export default App;
