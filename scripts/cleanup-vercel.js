// Vercel 빌드 환경에서 불필요한 hardhat 관련 패키지 제거
// 주의: rollup 관련 패키지는 vite 빌드에 필요하므로 제거하지 않음
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
      // Ignore errors - 패키지가 없을 수 있음
    }
  });
  
  console.log('Vercel cleanup completed. Rollup packages preserved for build.');
}

