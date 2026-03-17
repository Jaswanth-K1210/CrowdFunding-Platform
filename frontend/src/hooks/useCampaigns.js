import { useState, useEffect } from "react";
import { campaignService } from "../services/campaignService";

export function useCampaigns(params) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campaignService
      .getAll(params)
      .then((res) => setCampaigns(res.data.campaigns || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { campaigns, loading };
}
