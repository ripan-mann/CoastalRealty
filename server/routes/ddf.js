// server/routes/ddf.js
import express from "express";
import axios from "axios";
import getAccessToken from "../utils/getAccessToken.js";

const router = express.Router();

router.get("/member/:agentKey", async (req, res) => {
  const agentKey = String(req.params.agentKey);

  if (!/^\d+$/.test(agentKey)) {
    return res.status(400).json({ error: "Invalid agentKey" });
  }

  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `https://ddfapi.realtor.ca/odata/v1/Member?$filter=MemberKey eq '${agentKey}'`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data.value); // Return only listing array
  } catch (error) {
    console.error("DDF Fetch Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch properties from DDF®" });
  }
});

router.get("/openh/:listingKey", async (req, res) => {
  const listingKey = String(req.params.listingKey);

  if (!/^\d+$/.test(listingKey)) {
    return res.status(400).json({ error: "Invalid listingKey" });
  }

  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `https://ddfapi.realtor.ca/odata/v1/OpenHouse?$filter=ListingKey eq '${listingKey}'`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data.value); // Return only listing array
  } catch (error) {
    console.error("DDF Fetch Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch properties from DDF®" });
  }
});
router.get("/openh", async (req, res) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `https://ddfapi.realtor.ca/odata/v1/OpenHouse`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data.value); // Return only listing array
  } catch (error) {
    console.error("DDF Fetch Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch properties from DDF®" });
  }
});

router.get("/properties", async (req, res) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(
      "https://ddfapi.realtor.ca/odata/v1/Property?$filter=ListOfficeKey eq '61022'&$count=true",
      // "StandardStatus": "Sold",
      // "AvailabilityDate": "2019-08-24T14:15:22Z",
      // "OriginalEntryTimestamp": null,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const totalCount = response.data["@odata.count"];
    console.log("Total records:", totalCount);
    res.json(response.data.value); // Return only listing array
  } catch (error) {
    console.error("DDF Fetch Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch properties from DDF®" });
  }
});

export default router;
