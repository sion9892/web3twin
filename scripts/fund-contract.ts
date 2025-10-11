import { ethers } from "hardhat";

async function main() {
  console.log("Funding contract with ETH for gasless minting...");

  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Hardhat default
  
  // Fund contract with 5 ETH for gas payments
  const amount = ethers.parseEther("5");
  
  await deployer.sendTransaction({
    to: contractAddress,
    value: amount,
  });

  console.log(`Funded contract ${contractAddress} with 5 ETH`);
  
  // Check contract balance
  const contractBalance = await ethers.provider.getBalance(contractAddress);
  console.log(`Contract balance: ${ethers.formatEther(contractBalance)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
