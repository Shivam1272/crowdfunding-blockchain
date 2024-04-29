import { ethers } from "ethers";
import { NextResponse } from "next/server";

import connectBlockchain from "@/utils/connectBlockchain";

export async function GET() {
  try {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      SmartContract["abi"],
      signer
    );

    const total = await contract.totalCollected();
    return NextResponse.json(
      { total: ethers.formatEther(total.toString()) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {},
      { status: 500, statusText: "Somethings went wrong." }
    );
  }
}
