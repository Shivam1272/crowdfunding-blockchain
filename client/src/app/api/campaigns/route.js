import { ethers } from "ethers";
import { NextResponse } from "next/server";
import connectBlockchain from "@/utils/connectBlockchain";
import SmartContract from "../../../../../smart-contract/artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
export async function GET(req) {
  try {
    // console.log("yppp");
    const url = new URL(req.url);
    const owner = url.searchParams.get("owner");
    // const { signer, contract } = connectBlockchain(owner);
    // console.log("signer", signer);
    // console.log("contract", contract);
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const signer = await provider.getSigner();
    // console.log("pr", provider);
    // console.log("sg", signer);
    const contract = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      SmartContract["abi"],
      signer
    );
    // console.log(contract);
    let allCampaigns = await contract.getCampaigns();
    // console.log("all campaigns", allCampaigns);

    if (owner)
      allCampaigns = allCampaigns.filter(
        (campaign) => campaign.owner === owner
      );

    const parsedCampaigns = allCampaigns.map((campaign, i) => ({
      id: i,
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      target: ethers.formatEther(campaign.target.toString()),
      deadline: Number(campaign.deadline),
      collectedAmount: ethers.formatEther(campaign.collectedAmount.toString()),
      withdrawedAmount: ethers.formatEther(
        campaign.withdrawedAmount.toString()
      ),
      donations: campaign.donations.map((donation) => ({
        donator: donation.donator,
        amount: ethers.formatEther(donation.amount.toString()),
      })),
    }));

    return NextResponse.json({ campaigns: parsedCampaigns }, { status: 200 });
  } catch (error) {
    // console.log("error", error);
    return NextResponse.json(
      {},
      { status: 500, statusText: "Somethings went wrong." }
    );
  }
}

export async function POST(req) {
  try {
    const { contract } = connectBlockchain();
    // const { contract } = useEthersContext();

    const { title, description, imageUrl, target, deadline } = await req.json();

    const cam = await contract.createCampaign(
      title,
      description,
      imageUrl,
      target,
      deadline,
      { gasLimit: 1000000 }
    );
    // console.log(cam);
    return NextResponse.json(
      {},
      { status: 201, statusText: "Campaign created successfully." }
    );
  } catch (error) {
    return NextResponse.json(
      {},
      { status: 500, statusText: "Somethings went wrong." }
    );
  }
}
