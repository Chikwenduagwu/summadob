import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { supply, fdv, circulatingPct, vesting, price, circulatingTokens, initMC } = req.body;

  try {
    const dobbyRes = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DOBBY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b",
        messages: [
          {
            role: "system",
            content: "You are Dobby AI, a professional tokenomics assistant. Explain results clearly, warn about risks, and be concise."
          },
          {
            role: "user",
            content: `Tokenomics Simulation:
            - Supply: ${supply}
            - FDV: ${fdv}
            - Circulating%: ${circulatingPct}
            - Vesting: ${vesting || "N/A"}
            - Price: ${price}
            - Circulating Tokens: ${circulatingTokens}
            - Initial Market Cap: ${initMC}`
          }
        ],
        max_tokens: 250
      })
    });

    const data = await dobbyRes.json();
    const message = data.choices?.[0]?.message?.content || "Dobby had no insights.";
    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dobby request failed" });
  }
}
