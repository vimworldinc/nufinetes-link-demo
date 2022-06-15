import Header from "../components/Header";

import EthKovan from "../components/contractCallComponents/EthKovan";

export default function Home() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: "center" }}>
        Eth 合约调用
        <br />
        本示例提供了 Kovan 测试网上的余额查询与合约调用
      </div>

      <div
        style={{ display: "flex", flexFlow: "wrap", fontFamily: "sans-serif" }}
      >
        <EthKovan />
      </div>
    </div>
  );
}
