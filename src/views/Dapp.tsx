import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import Header from "../components/Header";
import { AccountProvider } from "../components/AccountProvider";
import Dapp from "../components/dappComponents/Dapp";

import { MetaMask } from "@web3-react/metamask";
import { NufinetesConnector } from "@vimworld/nufinetes-link";
import type { Connector } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";
// import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as nufinetesHooks, nufinetes } from "../connectors/nufinetes";
// import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'

const connectors: [
  MetaMask | NufinetesConnector | WalletConnect,
  Web3ReactHooks
][] = [
  [nufinetes, nufinetesHooks],
  // [metaMask, metaMaskHooks],
  // [walletConnect, walletConnectHooks],
];

export default function Home() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: "center" }}>
        Dapp Example
        <br />
        This example provides a simulation of Dapp-related business, such as the
        need to obtain a login token after the wallet is connected, and the feature
        of multi-wallet login
      </div>

      <Web3ReactProvider connectors={connectors} lookupENS={false}>
        <AccountProvider>
          <Dapp />
        </AccountProvider>
      </Web3ReactProvider>
    </div>
  );
}
