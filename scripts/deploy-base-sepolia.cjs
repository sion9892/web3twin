const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying Web3TwinNFT contract to Base Sepolia...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  
  if (!deployer) {
    console.error("❌ Error: Could not get deployer account!");
    console.log("Please check your PRIVATE_KEY in .env file");
    process.exit(1);
  }
  
  console.log("📍 Deploying from address:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.error("❌ Error: Deployer account has no ETH!");
    console.log("Please get Base Sepolia testnet ETH from:");
    console.log("  - https://www.coinbase.com/faucets");
    console.log("  - https://docs.base.org/docs/tools/network-faucets");
    process.exit(1);
  }

  console.log("📝 Deploying contract...");
  const Web3TwinNFT = await ethers.getContractFactory("Web3TwinNFT");
  const web3TwinNFT = await Web3TwinNFT.deploy();

  await web3TwinNFT.waitForDeployment();

  const address = await web3TwinNFT.getAddress();
  console.log("✅ Web3TwinNFT deployed to:", address);
  console.log("🔗 View on BaseScan:", `https://sepolia.basescan.org/address/${address}`);

  // Save contract info
  const contractInfo = {
    address: address,
    network: "baseSepolia",
    chainId: 84532,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address
  };
  
  fs.writeFileSync(
    './contract-info-basesepolia.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("📄 Contract info saved to contract-info-basesepolia.json");
  console.log("\n🎯 Next steps:");
  console.log("1. Update src/lib/wagmi.ts with the new contract address");
  console.log(`2. Replace CONTRACT_ADDRESS.baseSepolia with: '${address}'`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

