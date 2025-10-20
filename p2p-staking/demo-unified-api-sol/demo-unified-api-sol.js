/*
Demo code to showcase SOL staking flow: stake, unstake, and withdraw transactions
This script demonstrates how to interact with the Solana blockchain to perform staking operations.
When running this code, users can expect to:
  1. Stake a specified amount of tokens on the Solana testnet.
  2. Unstake tokens from the Solana testnet.
  3. Withdraw staked tokens from the Solana testnet.
  4. Sign the staking, unstaking, and withdrawal transactions using a Solana signer.
  5. Broadcast the signed transactions and log the broadcast response.
Users should observe the following:
  - The staking, unstaking, and withdrawal transactions being signed and logged to the console.
  - The broadcast response being logged to the console.
  - Any errors that occur during the staking, unstaking, or withdrawal process being logged to the console.
The script assumes that the user has a valid Solana testnet account and a P2P API token.
Users should replace '<SOL_MNEMONIC>' with their actual Solana mnemonic and '<YOUR_TOKEN>' with their actual P2P API token, respectively.
*/

import { SignerFactory, Signers } from "@p2p-org/signer-sdk";
import fetch from "node-fetch";

const config = {
  solRpcNode: "https://api.testnet.solana.com",
  networkName: "testnet",
  solanaAddress: "<STAKER_ADDRESS>",
  solanaPrivateKeys: ["<YOUR_PRIVATE_KEY_IN_bs58"], // obtained after converting Int[] to bs58, check privateKeysTobs58() function or https://www.npmjs.com/package/bs58
  stakeAccount: "<STAKE_ACCOUNT>", // obtained after staking
};

const apiBase = "https://api-test.p2p.org/api/v1/unified";
const token = "<YOUR_TOKEN>"; // Handle token securely

// Function to stake
async function stake(chain, network, stakerAddress, amount) {
  const url = `${apiBase}/staking/stake`;
  const body = { chain, network, stakerAddress, amount };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Stake API error: ${response.statusText}`);
    const data = await response.json();
    return signAndBroadcast(
      data.result.unsignedTransactionData,
      config,
      chain,
      network,
      stakerAddress
    );
  } catch (error) {
    console.error("Staking failed:", error);
    throw error;
  }
}

// Function to unstake
async function unstake(chain, network, stakerAddress, amount, stakeAccount) {
  const url = `${apiBase}/staking/unstake`;
  const body = {
    chain,
    network,
    stakerAddress,
    extra: { amount, stakeAccount },
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Unstake API error: ${response.statusText}`);
    const data = await response.json();
    return signAndBroadcast(
      data.result.unsignedTransactionData,
      config,
      chain,
      network,
      stakerAddress
    );
  } catch (error) {
    console.error("Unstaking failed:", error);
    throw error;
  }
}

// Function to withdraw
async function withdraw(chain, network, stakerAddress, amount) {
  const url = `${apiBase}/staking/withdraw`;
  const body = { chain, network, stakerAddress, extra: { amount } };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Withdraw API error: ${response.statusText}`);
    const data = await response.json();
    return signAndBroadcast(
      data.result.unsignedTransactionData,
      config,
      chain,
      network,
      stakerAddress
    );
  } catch (error) {
    console.error("Withdraw failed:", error);
    throw error;
  }
}

// Sign and broadcast transaction
async function signAndBroadcast(
  unsignedTransactionData,
  config,
  chain,
  network,
  stakerAddress
) {
  const signer = SignerFactory.createSigner(Signers.Solana, config);
  const signedTx = await signer.sign({
    unsignedTransaction: unsignedTransactionData,
  });
  console.log("Signed transaction:", signedTx);

  const broadcastUrl = `${apiBase}/transaction/broadcast`;
  const broadcastBody = {
    chain,
    network,
    stakerAddress,
    signedTransaction: signedTx.signature,
    extra: { unsignedTransaction: signedTx.transaction },
  };

  try {
    const response = await fetch(broadcastUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(broadcastBody),
    });
    if (!response.ok)
      throw new Error(`Broadcast API error: ${response.statusText}`);
    const broadcastData = await response.json();
    console.log("Broadcast response:", broadcastData);
    return broadcastData;
  } catch (error) {
    console.error("Broadcast failed:", error);
    throw error;
  }
}

// Convert private keys to bs58
function privateKeysTobs58(solanaPrivateKeys) {
  const bytes = Uint8Array.from(solanaPrivateKeys);
  const address = bs58.encode(bytes);
  return address;
}

// Example usage
async function main() {
  const chain = "solana";
  const network = config.networkName;
  const stakerAddress = config.solanaAddress;
  const amount = "1002282880";
  const stakeAccount = config.stakeAccount;

  try {
    console.log("Staking...");
    await stake(chain, network, stakerAddress, amount);
    console.log("Unstaking...");
    await unstake(chain, network, stakerAddress, amount, stakeAccount);
    console.log("Withdrawing...");
    await withdraw(chain, network, stakerAddress, amount);
  } catch (error) {
    console.error("Flow failed:", error);
  }
}

main();
