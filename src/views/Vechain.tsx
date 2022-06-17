import Header from "../components/Header";

import VechainTest from "../components/contractCallComponents/VechainTest";

export default function Home() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: "center" }}>
        Vechain Contract Call
        <br />
        This example provides balance inquiries and contract calls on the
        VeChain testnet
      </div>

      <div
        style={{ display: "flex", flexFlow: "wrap", fontFamily: "sans-serif" }}
      >
        <VechainTest />
      </div>
    </div>
  );
}
