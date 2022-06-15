import Header from "../components/Header";

import VechainTest from "../components/contractCallComponents/VechainTest";

export default function Home() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: "center" }}>
        Vechain 合约调用
        <br />
        本示例提供了维链测试网上的余额查询与合约调用
      </div>

      <div
        style={{ display: "flex", flexFlow: "wrap", fontFamily: "sans-serif" }}
      >
        <VechainTest />
      </div>
    </div>
  );
}
