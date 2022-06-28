import { formatUnits } from "ethers/lib/utils";
import { Contract } from "@ethersproject/contracts";
import { useEffect, useState } from "react";
import { hooks, nufinetes } from "../../connectors/nufinetes";
import { Accounts } from "../Accounts";
import { Card } from "../Card";
import { Chain } from "../Chain";
import { Status } from "../Status";
import ERC20_ABI from "./erc20.json";
import { RPCSubprovider, SignerSubprovider, Web3JsProvider, Web3ProviderEngine } from "@0x/subproviders";
import { Web3Provider } from "@ethersproject/providers";

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
} = hooks;

const USDT_Addr = "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684";
const Mock_Contract = "0x891Fb1372C815B62e1ddB6520eC54f5A6E0Ee625";
export const GAS_LIMIT_COSTS = 1000;
export default function NefinetesCard() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();
  const _isActive = useIsActive();
  const isActive = accounts && _isActive;

  const provider = useProvider();

  const [ethBalance, setEthBalance] = useState(0);
  const [linkBalance, setUSDTBalance] = useState(0);
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [txHash, setTxHash] = useState("");
  // const ENSNames = useENSNames(provider)
  // attempt to connect eagerly on mount
  // console.log(nufinetes.provider.uri)
  useEffect(() => {
    void nufinetes.connectEagerly();
  }, []);

  const getNativeTokenBalance = async (account, provider): Promise<number> => {
    try {
      if (!account || !provider) {
        return;
      }
      const _balance = await provider.getBalance(account);
      if (+_balance || +_balance === 0) {
        return +formatUnits(_balance, 18);
      }
      return null;
    } catch (error) {
      console.log(error, "check balance error");
      return null;
    }
  };

  const APPROVE_AMOUNT = "0xffffff";

  const handleBalanceAndApprove = async () => {
    // ;(provider as any).sendCustomRequest(signParams)
    // return
    const balance = await getNativeTokenBalance(accounts[0], provider);
    // console.log(balance, 'check balance')
    setEthBalance(balance);
    
    const contract = new Contract(USDT_Addr, ERC20_ABI, provider.getSigner());
    const _balance = await contract.balanceOf(accounts[0]);
    const _decimals = await contract.decimals();

    setUSDTBalance(+formatUnits(_balance, _decimals));

    const addressApprowed = await contract.allowance(
      accounts[0],
      Mock_Contract,
      {
        gasLimit: 1000000,
      }
    );
    setApprovedAmount(Number(addressApprowed));
  };

  const getApprove = async () => {
    // here shows how to combile web3-provider-engine with ethers contract instance
    const web3ProviderEngine = new Web3ProviderEngine()
    const sp = new SignerSubprovider(provider.provider as Web3JsProvider)
    web3ProviderEngine.addProvider(sp)
    web3ProviderEngine.addProvider(new RPCSubprovider('https://data-seed-prebsc-1-s1.binance.org:8545'))
    web3ProviderEngine.start()

    const contract = new Contract(USDT_Addr, ERC20_ABI, new Web3Provider(web3ProviderEngine).getSigner());

    const tx = await contract.approve(Mock_Contract, APPROVE_AMOUNT, {});
    setTxHash(tx.hash);
    const receipt = await tx.wait();
  };

  return (
    <Card>
      <div>
        <b>Nufinetes</b>
        <Status isActivating={isActivating} error={error} isActive={isActive} />
        <div style={{ marginBottom: "1rem" }} />
        <Chain chainId={chainId} />
        <Accounts accounts={accounts} />
      </div>
      <div style={{ marginBottom: "1rem" }} />

      {!isActive && (
        <button onClick={() => nufinetes.activate(42)}>Connect</button>
      )}

      {isActive && (
        <button onClick={() => nufinetes.deactivate()}>Disconnect</button>
      )}

      {chainId === 97 ? (
        <>
          {" "}
          <button onClick={handleBalanceAndApprove}>
            Get Balance And Approve
          </button>
          <div>Bnb Balance: {ethBalance}</div>
          <div>USDT Balance: {linkBalance}</div>

          <button onClick={getApprove}>Contract call test</button>
          <div style={{ wordBreak: "break-all" }}>Tx Hash: {txHash}</div>
          <div style={{ marginTop: 10 }}>USDT Contract Address: </div>
          <div>{USDT_Addr}</div>
          <div style={{ color: "green" }}>USDT Faucet Address: </div>
        </>
      ) : (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          Please Switch to Bnb Testnet on Nufinetes
        </span>
      )}
    </Card>
  );
}
