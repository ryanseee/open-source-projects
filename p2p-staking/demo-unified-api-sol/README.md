# Unified API - Solana Staking Demo

This repository contains a demo code for staking, unstaking, and withdrawing SOL tokens on the Solana blockchain using the P2P.org API.

### Prerequisites

- Node.js (>= 14.17.0)
- npm (>= 6.14.13)
- A valid Solana testnet account
- A P2P.org API token

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Replace the placeholders in the code with your actual values:

- `<STAKER_ADDRESS>`: Your Solana wallet address
- `<STAKE_ACCOUNT>`: Your Solana stake account address (obtained after creating staking request)
- `<YOUR_TOKEN>`: Your P2P.org API token
- `<<YOUR_PRIVATE_KEY_IN_bs58>`: Your Solana wallet private key (in bs58 format)

### Usage

1. Run the demo code: `node demo-unified-api-sol.js`
2. The script is designed to perform the staking flow step by step. You can comment/uncomment the desired sections to work through the demo:

- Stake a specified amount of SOL tokens
- Unstake the SOL tokens
- Withdraw the SOL tokens

### API Endpoints

The demo code uses the following P2P.org API endpoints:

- `POST /staking/stake`: Stake SOL tokens
- `POST /staking/unstake`: Unstake SOL tokens
- `POST /staking/withdraw`: Withdraw SOL tokens
- `POST /transaction/broadcast`: Broadcast a signed transaction

### Troubleshooting

- Check the console logs for any error messages
- Verify that your Solana testnet account and P2P.org API token are valid
- Ensure that you have sufficient SOL tokens in your account for staking

### Contributing

Contributions are welcome! If you have any issues or suggestions, please open an issue or submit a pull request.

### License

This repository is licensed under the MIT License. See [LICENSE](LICENSE) for details.
