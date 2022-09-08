import { ethers, Wallet } from "ethers";
import { isSignedByWallet } from "../web3Auth.shared";
describe(`Web3 Login`, () => {
  const hardHatAccountAddress0 = `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`;
  const privateKeyAccount0 =
    `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`;
  const wallet = new Wallet(privateKeyAccount0);

  it(`should able to verify message signed by the address`, async () => {
    const message = `The message to be signed`;
    const signature = await wallet.signMessage(message);
    const isSigned = isSignedByWallet(hardHatAccountAddress0, message, signature);
    expect(isSigned).toBe(true);
  });

  it(`should not verify if message was sign by some other address`, async () => {
    const message = `The message to be signed`;
    const signature = await wallet.signMessage(message);
    const isSigned = isSignedByWallet(
      `0x0000000000000000000000000000000000000000`,
      message,
      signature
    );
    expect(isSigned).toBe(false);
  });
});
