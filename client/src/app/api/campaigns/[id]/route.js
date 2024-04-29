import { NextResponse } from "next/server";
import { ethers } from "ethers";

import SmartContract from "../../../../../../smart-contract/artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const signer = await provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      SmartContract["abi"],
      signer
    );

    console.log(contract);
    await contract.closeCampaign(id, { gasLimit: 1000000 });

    return NextResponse.json(
      {},
      { status: 200, statusText: "Campaign closed successfully." }
    );
  } catch (error) {
    console.log(error.error.message);
    return NextResponse.json(
      {},
      { status: 500, statusText: "Somethings went wrong." }
    );
  }
}
