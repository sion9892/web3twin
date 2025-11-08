const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x2C4C60cfF5CB69B3Cb6BEd2f28fFBDd7F8987706";
  
  console.log("🔍 Verifying contract on Basescan...");
  console.log("Contract Address:", contractAddress);
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // Web3TwinNFT constructor takes no arguments
    });
    
    console.log("✅ Contract verified successfully!");
    console.log(`🔗 View on Basescan: https://basescan.org/address/${contractAddress}#code`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      console.log("\n💡 Manual verification:");
      console.log("1. Go to https://basescan.org/address/" + contractAddress);
      console.log("2. Click 'Contract' tab → 'Verify and Publish'");
      console.log("3. Select 'Solidity (Single file)'");
      console.log("4. Compiler: 0.8.20");
      console.log("5. Optimization: Yes, 200 runs");
      console.log("6. Paste the contract code");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

