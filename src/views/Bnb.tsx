import Header from "../components/Header";

import BnbTestnet from "../components/contractCallComponents/bnbTestnet";

export default function Home() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: "center" }}>
        Bnb Contract Call
        <br />
        This example provides balance query and contract call on the Bnb
        testnet, and shows how to use web3-provider-engine for ethers contract instance.
      </div>

      <div
        style={{ display: "flex", flexFlow: "wrap", fontFamily: "sans-serif" }}
      >
        <BnbTestnet />
      </div>
    </div>
  );
}
