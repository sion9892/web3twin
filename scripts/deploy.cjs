const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  console.log("Deploying Web3TwinNFT contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const Web3TwinNFT = await ethers.getContractFactory("Web3TwinNFT");
  const web3TwinNFT = await Web3TwinNFT.deploy();

  await web3TwinNFT.waitForDeployment();

  const address = await web3TwinNFT.getAddress();
  console.log("Web3TwinNFT deployed to:", address);

  // Save the contract address to a file for frontend use
  const fs = require('fs');
  const contractInfo = {
    address: address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    './contract-info.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to contract-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
