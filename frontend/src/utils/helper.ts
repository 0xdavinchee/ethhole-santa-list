import { ethers } from "ethers";
import SantasListABI from "../artifacts/contracts/SantasList.sol/SantasList.json";
import { SantasList as SantasListInterface } from "../../../typechain";

export const isGlobalEthereumObjectEmpty =
  typeof (window as any).ethereum == null;

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";

export async function requestAccount() {
  const ethereum = (window as any).ethereum;
  if (isGlobalEthereumObjectEmpty) return;

  return await ethereum.request({ method: "eth_requestAccounts" });
}

export function initializeContract(requiresSigner: boolean) {
  const ethereum = (window as any).ethereum;
  if (isGlobalEthereumObjectEmpty) return;
  const provider = new ethers.providers.Web3Provider(ethereum);
  if (requiresSigner) {
    const signer = provider.getSigner();
    const santasListContract = new ethers.Contract(
      contractAddress,
      SantasListABI.abi,
      signer
    ) as unknown as SantasListInterface;
    return santasListContract;
  }
  const santasListContract = new ethers.Contract(
    contractAddress,
    SantasListABI.abi,
    provider
  ) as unknown as SantasListInterface;
  return santasListContract;
}
