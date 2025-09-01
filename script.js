document.getElementById("simulatorForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const supply = parseFloat(document.getElementById("supply").value);
  const fdv = parseFloat(document.getElementById("fdv").value);
  const circulatingPct = parseFloat(document.getElementById("circulating").value);
  const vesting = parseFloat(document.getElementById("vesting").value) || null;

  // basic calculations
  const price = fdv / supply;
  const circulatingTokens = (circulatingPct / 100) * supply;
  const initMC = circulatingTokens * price;

  // show results
  document.getElementById("results").innerHTML = `
    <p><b>Launch Price:</b> $${price.toFixed(4)}</p>
    <p><b>Circulating Tokens at TGE:</b> ${circulatingTokens.toLocaleString()}</p>
    <p><b>Initial Market Cap:</b> $${initMC.toLocaleString()}</p>
    ${vesting ? `<p><b>Vesting:</b> ${vesting} months</p>` : ""}
  `;

  // ask dobby for explanation
  const response = await fetch("/api/dobby", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ supply, fdv, circulatingPct, vesting, price, circulatingTokens, initMC })
  });

  const data = await response.json();
  document.getElementById("dobbyResponse").textContent = data.message || "No response from Dobby.";
});
