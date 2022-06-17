# Nufinetes-Link Demo

## Version 1.0

This is a collection of demos used to show the usage of Nufinetes-Link sdk, currently provides 5 pages, they are:

1. Multi wallet connection example and native Web3Provider usage example

![image](https://github.com/vimworldinc/nufinetes-link-demo/blob/main/src/static/nufi-1.png)

#### You can connect with multiple wallets including Nufinetes at the same time, and observe the status of the wallet connections through each wallet panel

![image](https://github.com/vimworldinc/nufinetes-link-demo/blob/main/src/static/nufi-2.png)

The native Web3Provider provides multiple states for specific business use

2. Extension provider and multi-account login simulation demo

![image](https://github.com/vimworldinc/nufinetes-link-demo/blob/main/src/static/nufi-3.png)

#### Simulate the scenario where Vimworld Dapp needs to obtain tokens after connecting the wallet, and simulate the scenario where multiple wallet accounts log in

3. Eth sign example (PersonalSign 和 SignTypedData_v4)

![image](https://github.com/vimworldinc/nufinetes-link-demo/blob/main/src/static/nufi-4.png)

#### Show and compare the results of Nufinetes and MetaMask signing while ensuring that the wallet account used to sign is the same

4. Eth kovan testnet contract call
5. Vechain testnet contract call

#### The contract call will be described in detail below

For how to use Nufinetes-Link, please refer to [Nufinetes-Link](https://github.com/vimworldinc/nufinetes-link)

Here we will introduce the usage methods related to contract calls under the Eth Kovan testnet and Vechain testnet

## Eth Contract Call

### Get native token balance

```jsx
// useAccount and useProvider are both web3react standard hooks
const account = useAccount();
const provider = useProvider();

const getNativeTokenBalance = async (account, provider): Promise<number> => {
  try {
    if (!account || !provider) {
      return;
    }

    // The provider provided by nufineates-link is a web3 provider that extends the relevant functions of wallet connect, and it can directly call related web3 provider methods
    const _balance = await provider.getBalance(account);
    if (+_balance || +_balance === 0) {
      return +formatUnits(_balance, 18);
    }
    return 0;
  } catch (error) {
    throw error;
  }
};
```

### Get Erc20 token balance and approve amount

```jsx
const accounts = useAccounts();

const handleBalanceAndApprove = async () => {
  // We get the signer needed to initialize the contract (ethers method) by calling the getSigner method on the provider
  // Here we use the Link contract on kovan for demonstration
  const contract = new Contract(Link_Addr, ERC20_ABI, provider.getSigner());
  const _balance = await contract.balanceOf(accounts[0]);
  const _decimals = await contract.decimals();

  setLinkBalance(+formatUnits(_balance, _decimals));

  const addressApprowed = await contract.allowance(accounts[0], Mock_Contract, {
    gasLimit: 1000000,
  });

  setApprovedAmount(Number(addressApprowed));
};
```

### Make a contract call for approve

```jsx
const getApprove = async () => {
  // Still generate a contract instance
  const contract = new Contract(Link_Addr, ERC20_ABI, provider.getSigner());
  const tx = await contract.approve(Mock_Contract, APPROVE_AMOUNT, {});
  setTxHash(tx.hash);

  const receipt = await tx.wait();
  console.log(receipt, "receipt result");
};
```

As shown above, you can use the provider provided by Nufinetes-Link as a full-featured web3 provider, and then the operation of related contracts is no different from when you use the web3 provider provided by MetaMask or other evm-compatible wallets.

However, the provider provided by Nufinetes-Link is not only a web3-provider, but also an instance of Wallet Connect connection. Next, we will introduce the features of this part

## Vechain Contract Call

Under Vechain, we need to use connex for contract interaction

```jsx
import Connex from "@vechain/connex";

// Initialize the connex instance under testnet
const connex = new Connex({
  node: "https://testnet.veblocks.net/", // veblocks public node, use your own if needed
  network: "test", // defaults to mainnet, so it can be omitted here
});
```

### Get balance of Veed

```jsx
  // We will use Veed contract in this example, the Veed contract we used here is a Vip180 contract, just like an Erc20 contract on Eth chain
  const balanceOfVeed = async () => {
      // declare the balanceOf abi, the abi is a Vip180 abi.
      const balanceOfABI = {
          constant: true,
          inputs: [{name: '_owner', type: 'address'}],
          name: 'balanceOf',
          outputs: [{name: 'balance', type: 'uint256'}],
          payable: false,
          stateMutability: 'view',
          type: 'function',
      }

      // make a contract instance by thor.account method
      const acc = connex.thor.account(Veed_Addr)
      // select the balanceOf method by balanceOfAbi
      const method = acc.method(balanceOfABI)
      // make the contract call
      const result = await method.call(accounts[0])

      // after decode the contract call result, we can get the Veed balance of your current Nufinetes account
      const fnABI = new Devkit.abi.Function(balanceOfABI as Devkit.abi.Function.Definition)
      const balanceRes = fnABI.decode(result.data)
      setVeedBalance(balanceRes.balance / 1e18)
   }
```

As shown above, we only need the account field provided by Nufinetes-Link to pass in the relevant contract instance to call, and the next contract transfer request will be slightly different

### Transfer veed to a target account

```jsx
const transferVeed = async () => {
  if (!amountValue || Number.isNaN(+amountValue)) {
    alert("Please input number");
    return;
  } else if (!address) {
    alert("Please input receiver address");
    return;
  }

  const transferABI = {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  };

  // transfer input amount to BigInt
  const big = BigInt(parseFloat(amountValue) * Math.pow(10, 18));

  const params = [address, big.toString()];

  // create a clause for contract call
  const clauseParams = connex.thor
    .account(Veed_Addr)
    .method(transferABI)
    .asClause(...params);
  const clause = [{ comment: `Transfer ${amountValue} VEED`, ...clauseParams }];

  // get transaction result by contractRequest function
  const transactionRes = await contractRequest({
    address: accounts[0].toLocaleLowerCase(),
    comment: `Transfer ${amountValue} VEED`,
    clauseList: clause,
  });

  if (transactionRes && transactionRes.txid) {
    setTxHash(transactionRes.txid);
  }
};
```

the contractRequest function will use the Nufinetes-Link provider to make a contract call on Nufinetes

```jsx
  const contractRequest = async (params): Promise<{ txid: string }> => {
    const { address, clauseList } = params;
    try {
      // create a wallet connect request JSON param
      const transferTokenJSON = {
        id: 1,
        jsonrpc: "2.0",
        method: "vechain_transaction",
        params: [
          clauseList,
          {
            broadcast: true,
            chainId: (provider as WalletConnect).chainId,
            signer: address,
          },
        ],
      };

      // make a contract call by sendCustomRequest method on WalletConnect instance
      const res = await (provider as WalletConnect).sendCustomRequest(transferTokenJSON);
      return res;
    } catch (error) {
      console.log({ error });
      return Promise.reject(error.message || "Payment failed");
    }
  };
```

In the example of the Eth contract invocation, we use the Nufinetes-Link provider as a standard web3 provider. In the Vechain contract invocation, we can directly treat the Nufinetes-Link provider as a WalletConnect instance to use its methods

============================================================

If you have any questions, please file an issue here: [Issue Link](https://github.com/vimworldinc/nufinetes-link-demo/issues)
