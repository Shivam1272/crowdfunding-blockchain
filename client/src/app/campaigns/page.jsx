import { Card } from "@/components";

const fetchCampaigns = async (sort) => {
  const res = await fetch(`http://localhost:3000/api/campaigns`, {
    method: "GET",
    cache: "no-cache",
  });
  const data = await res.json();
  let campaigns = data.campaigns;

  if (!campaigns) campaigns = [];

  if (sort === undefined || sort === null) return campaigns;
  else if (sort === "newest") return campaigns.slice(-9).reverse();

  campaigns.sort((a, b) => b.collectedAmount - a.collectedAmount);
  return campaigns.slice(0, 9);
};

const Campaigns = async ({ searchParams }) => {
  const campaigns = await fetchCampaigns(searchParams.sort);

  return (
    <div>
      <h1 className="text-xl mb-4">
        {!searchParams.sort
          ? `All Campaigns (${campaigns?.length ?? 0})`
          : searchParams.sort === "newest"
          ? `Newest Campaigns (${campaigns?.length ?? 0})`
          : `Top Campaigns (${campaigns?.length ?? 0})`}
      </h1>
      {campaigns?.length === 0 ? (
        <div className="flex flex-col  justify-center gap-4 mt-10">
          <h1 className="text-4xl font-semibold">No Campaigns Found</h1>
          <p className="text-lg text-neutral-400">
            It looks like there are no campaigns created yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {campaigns?.map((campaign) => (
            <Card campaign={campaign} key={campaign.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
