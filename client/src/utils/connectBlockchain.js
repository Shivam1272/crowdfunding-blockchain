import { ethers } from "ethers";
import SmartContract from "../../../smart-contract/artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";

export default (owner) => {
  const signer = owner;
  const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    SmartContract["abi"],
    signer
  );
  // console.log(contract);
  return { signer, contract };
};
