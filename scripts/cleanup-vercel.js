// Vercel 빌드 환경에서 불필요한 hardhat 관련 패키지 제거
if (process.env.VERCEL) {
  const fs = require('fs');
  const path = require('path');
  
  const hardhatDeps = [
    'hardhat',
    '@nomicfoundation/hardhat-chai-matchers',
    '@nomicfoundation/hardhat-ethers',
    '@nomicfoundation/hardhat-ignition',
    '@nomicfoundation/hardhat-ignition-ethers',
    '@nomicfoundation/hardhat-network-helpers',
    '@nomicfoundation/hardhat-toolbox',
    '@nomicfoundation/hardhat-verify',
    '@nomicfoundation/ignition-core',
    '@typechain/ethers-v6',
    '@typechain/hardhat',
    'chai',
    'ethers',
    'solidity-coverage',
    'hardhat-gas-reporter',
    'ts-node',
    'typechain',
    '@openzeppelin/contracts'
  ];
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  hardhatDeps.forEach(dep => {
    try {
      const depPath = path.join(nodeModulesPath, dep);
      if (fs.existsSync(depPath)) {
        fs.rmSync(depPath, { recursive: true, force: true });
        console.log(`Removed ${dep} for Vercel build`);
      }
    } catch (error) {
      // Ignore errors
    }
  });
  
  // Also remove hardhat config and contracts directory from node_modules if they exist
  try {
    const hardhatConfigPath = path.join(process.cwd(), 'hardhat.config.cjs');
    if (fs.existsSync(hardhatConfigPath)) {
      // Don't remove, just log
      console.log('Hardhat config found (keeping for reference)');
    }
  } catch (error) {
    // Ignore
  }
}

