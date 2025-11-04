const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying Web3TwinNFT contract to Base Mainnet...");

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
    console.log("Please ensure your account has Base ETH for deployment.");
    console.log("You can bridge ETH to Base at: https://bridge.base.org");
    process.exit(1);
  }

  // Warn about mainnet deployment
  console.log("⚠️  WARNING: You are deploying to Base MAINNET!");
  console.log("⚠️  This will cost real ETH. Make sure you want to proceed.");
  console.log("");

  console.log("📝 Deploying contract...");
  const Web3TwinNFT = await ethers.getContractFactory("Web3TwinNFT");
  const web3TwinNFT = await Web3TwinNFT.deploy();

  await web3TwinNFT.waitForDeployment();

  const address = await web3TwinNFT.getAddress();
  console.log("✅ Web3TwinNFT deployed to:", address);
  console.log("🔗 View on BaseScan:", `https://basescan.org/address/${address}`);

  // Save contract info
  const contractInfo = {
    address: address,
    network: "base",
    chainId: 8453,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address
  };
  
  fs.writeFileSync(
    './contract-info-base.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("📄 Contract info saved to contract-info-base.json");
  console.log("\n🎯 Next steps:");
  console.log("1. Update src/lib/wagmi.ts with the new contract address");
  console.log(`2. Replace CONTRACT_ADDRESS.base with: '${address}'`);
  console.log("3. Update app configuration to use Base mainnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

