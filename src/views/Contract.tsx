import Header from "../components/Header";

import EthKovan from "../components/contractCallComponents/EthKovan";

export default function Home() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: "center" }}>
        Eth Contract Call
        <br />
        This example provides balance query and contract call on the Kovan
        testnet
      </div>

      <div
        style={{ display: "flex", flexFlow: "wrap", fontFamily: "sans-serif" }}
      >
        <EthKovan />
      </div>
    </div>
  );
}
