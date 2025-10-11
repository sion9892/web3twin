import { ethers } from "hardhat";

async function main() {
  console.log("Funding test accounts with ETH...");

  const [deployer, user1, user2] = await ethers.getSigners();
  
  // Fund test accounts with 10 ETH each
  const amount = ethers.parseEther("10");
  
  await deployer.sendTransaction({
    to: user1.address,
    value: amount,
  });
  
  await deployer.sendTransaction({
    to: user2.address,
    value: amount,
  });

  console.log(`Funded ${user1.address} with 10 ETH`);
  console.log(`Funded ${user2.address} with 10 ETH`);
  
  // Check balances
  const user1Balance = await ethers.provider.getBalance(user1.address);
  const user2Balance = await ethers.provider.getBalance(user2.address);
  
  console.log(`User1 balance: ${ethers.formatEther(user1Balance)} ETH`);
  console.log(`User2 balance: ${ethers.formatEther(user2Balance)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
