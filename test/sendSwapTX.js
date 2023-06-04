const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const {
  addressFactory,
  addressRouter,
  addressFrom,
  addressTo,
} = require("../utils/AddressList");

const { erc20ABI, factoryABI, routerABI } = require("../utils/AbiList");

describe("Read and write to the blockchain", () => {
  let provider, contractFactory, contractRouter, contractToken;

  provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.g.alchemy.com/v2/0HrHlhFOcL8RCj8WQ0P_JjrzcLRAWoe4"
  );

  contractFactory = new ethers.Contract(addressFactory, factoryABI, provider);
  contractRouter = new ethers.Contract(addressRouter, routerABI, provider);
  contractToken = new ethers.Contract(addressFrom, erc20ABI, provider);

  const getAmountOut = async () => {
    const decimals = await contractToken.decimals();
    const amountInHuman = "1";
    const amountIn = ethers.utils.parseUnits(amountInHuman, decimals);

    const amountsOut = await contractRouter.getAmountsOut(amountIn, [
      addressFrom,
      addressTo,
    ]);

    return amountsOut[1].toString();
  };

  it("Connect to provider, factory, router and token", () => {
    assert(provider._isProvider);
    expect(contractFactory.address).eq(addressFactory);
    expect(contractRouter.address).eq(addressRouter);
    expect(contractToken.address).eq(addressFrom);
  });

  it("gets the price from amountsOut", async () => {
    const amount = await getAmountOut();
    assert(amount);
  });

  it("send transactions", async () => {
    const [ownerSigner] = await ethers.getSigners();
    const mainnetUniswapRouter = new ethers.Contract(
      addressRouter,
      routerABI,
      ownerSigner
    );

    const myAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    const amountInHuman = "1";
    const decimals = await contractToken.decimals();
    const amountIn = ethers.utils.parseUnits(amountInHuman, decimals);
    const amountOut = await getAmountOut();

    const txSwap = await mainnetUniswapRouter.swapExactTokensForTokens(
      amountIn,
      amountOut,
      [addressFrom, addressTo],
      myAddress,
      Date.now() + 1_000 * 60 * 5,
      {
        gasLimit: 200_000,
        gasPrice: ethers.utils.parseUnits("5.5", "gwei"),
      }
    );

    assert(txSwap.hash);
    const provider = ethers.provider;
    const txReceipt = await provider.getTransactionReceipt(txSwap.hash);

    console.log("");
    console.log("TXSWAP");
    console.log(txSwap);

    console.log("");
    console.log("TXReceipt");
    console.log(txReceipt);
  });
});
