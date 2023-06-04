const erc20ABI = ["function decimals() external pure returns (uint8)"];

const factoryABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
];

const routerABI = [
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
];

module.exports = {
  erc20ABI,
  factoryABI,
  routerABI,
};
