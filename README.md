

# Smart Wallet Application

## Overview

The Smart Wallet Application allows users to securely manage their Ether transactions through a smart contract. Users can log in via OTP or Google, connect their MetaMask wallet, and perform transactions such as depositing Ether into the smart wallet and transferring funds to other addresses. The application is built using React and interacts with Ethereum smart contracts using ethers.js.

## Features

- **User Authentication**: Login using OTP or Google Authentication.
- **MetaMask Integration**: Connect and disconnect your MetaMask wallet to interact with the Ethereum blockchain.
- **Smart Wallet Functionality**: 
  - Deposit Ether into the smart wallet.
  - Transfer Ether from the smart wallet to other addresses.
  - View wallet and smart wallet balances.

## Technologies Used

- **Frontend**: React.js
- **Blockchain**: Ethereum
- **Smart Contract**: Solidity
- **Libraries**: ethers.js for blockchain interactions, Firebase for authentication

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shashank9694/SmartWallet.git
   ```

2. Navigate to the project directory:
   ```bash
   cd SmartWallet
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up Firebase:
   - Create a Firebase project and configure authentication (OTP and Google).
   - Replace the Firebase configuration in `firebaseConfig.js` with your own.

5. Deploy the smart contract:
   - Compile and deploy the SmartWallet contract using a development environment like Remix or Hardhat.
   - Update the `CONTRACT_ADDRESS` in the `App.js` file with the deployed contract address.

6. Start the application:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and go to `http://localhost:3000`.
2. Choose to log in via OTP or Google.
3. After successful login, connect your MetaMask wallet.
4. You can deposit Ether to your smart wallet and transfer Ether to any address.

## Smart Contract

The smart wallet contract is written in Solidity. It allows the owner to deposit and transfer Ether while tracking the balance. Below is the code for the SmartWallet contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartWallet {
    address public owner;
    mapping(address => uint256) public balances;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the wallet owner");
        _;
    }

    constructor() {
        owner = msg.sender; // Set the creator of the contract as the owner
    }

    // Function to receive Ether
    receive() external payable {
        balances[msg.sender] += msg.value; // Track the balance of the sender
    }

    // Transfer funds to another address
    function transfer(address payable recipient, uint256 amount) public onlyOwner {
        require(balances[owner] >= amount, "Insufficient balance");
        recipient.transfer(amount);
        balances[owner] -= amount;
    }

    // Check balance of the wallet
    function getBalance() public view returns (uint256) {
        return balances[owner];
    }
}
```

## Contributing

Contributions are welcome! If you have suggestions or improvements, please fork the repository and create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ethers.js](https://docs.ethers.io/v6/) for Ethereum blockchain interactions.
- [Firebase](https://firebase.google.com/) for authentication.
- [MetaMask](https://metamask.io/) for wallet integration.
```



