// pages/index.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [tokenData, setTokenData] = useState(null);
  const [price, setPrice] = useState(null);

  // Metadata JSON URL (Vercel public folder)
  const metadataUrl = const metadataUrl = "/metadata.json"; // public folder me file hai

  // Proxy token address on BSC
  const proxyAddress = "0xBBB000d4866913F71BD502bE6C65Eeaac21Baf8B";

  // Fetch metadata
  useEffect(() => {
    axios.get(metadataUrl)
      .then(res => setTokenData(res.data))
      .catch(err => console.log("Metadata fetch error:", err));
  }, []);

  // Fetch token price from BSC
  useEffect(() => {
    if (!proxyAddress) return;

    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          `https://api.dexscreener.com/latest/dex/pairs/bsc/${proxyAddress}`
        );
        const priceUsd = response.data?.pair?.priceUsd;
        setPrice(priceUsd);
      } catch (err) {
        console.log("Price fetch error:", err);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000); // 10s update
    return () => clearInterval(interval);
  }, [proxyAddress]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {tokenData ? (
        <>
          <img
            src={tokenData.image}
            alt={tokenData.name}
            style={{ width: 100, height: 100 }}
          />
          <h1>{tokenData.name} ({tokenData.symbol})</h1>
          <h2>Price: ${price ?? "Loading..."}</h2>
        </>
      ) : (
        <p>Loading token data...</p>
      )}
    </div>
  );
}
