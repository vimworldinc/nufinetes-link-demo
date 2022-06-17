import { Link } from "react-router-dom";
import Header from "../components/Header";
import MetaMaskCard from "../components/connectors/MetaMaskCard";
import WalletConnectCard from "../components/connectors/WalletConnectCard";
import NefinetesCard from "../components/connectors/NefinetesCard";
import ProviderExample from "../components/ProviderExample";

export default function Home() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: "center" }}>
        Multi Wallet Connection
        <br />
        <br />
        This example provides two panels to display the linking status of
        Nufinetes and MetaMask respectively. MetaMask wallet can also actively
        switch the chain that needs to be connected
        <br />
        <br />
        Nufinetes has the highest priority, which means that if two wallets are
        connected at the same time, The connector provided by useWeb3React
        context will be Nufinetes, only Nufinetes is disconnected, the preferred
        connector will become MetaMask
      </div>

      <div
        style={{ display: "flex", flexFlow: "wrap", fontFamily: "sans-serif" }}
      >
        <NefinetesCard />
        <MetaMaskCard />
        <WalletConnectCard />
        {/* <CoinbaseWalletCard /> */}
        {/* <NetworkCard /> */}
      </div>

      <div style={{ fontSize: 18, width: 800, textAlign: "center" }}>
        An example of a native Web3ReactProvider is demonstrated here
        <br />
        <br />
        Native Web3ReactProvider provides connector, chainId, accounts,
        isActivating, error, account, isActive, provider and other wallet states
        or variables, it is enough for regular dapp&apos;s business needs, if there
        is additional state that needs to be maintained, then you can
        encapsulate a layer of provider in your business to provide status,
        status can also be maintained by other state management tools
        <br />
        <br />
        In the Dapp wallet example, the demonstration will encapsulate a layer
        of Provider according to business needs: To simulating Vimworld Dapp
        requires multi-account login and needs to obtain tokens separately
        <Link to="/dapp">Go and preview</Link>
      </div>

      <ProviderExample />
    </div>
  );
}
