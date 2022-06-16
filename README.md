# Nufinetes-Link Demo

## Version 1.0

这是一个用来展示 Nufinetes-Link sdk 用法的 demo 合集, 目前提供了 5 个页面, 分别是:

1. 多钱包链接示例与原生 Web3Provider 使用示例
2. 扩展 provider 和多账户登录模拟 demo
3. Eth 签名示例(PersonalSign 和 SignTypedData_v4)
4. Eth kovan testnet 下的合约调用
5. Vechain testnet 下的合约调用

关于 Nufinetes-Link 的使用介绍, 请参考 [Nufinetes-Link](https://github.com/vimworldinc/nufinetes-link)

在这里我们将介绍 Eth Kovan testnet 和 Vechain testnet 下合约调用相关的使用方法

## Eth Contract Call

### Get native token balance

```jsx
// useAccount 和 useProvider 都是 web3react 标准的 hooks
const account = useAccount();
const provider = useProvider();

const getNativeTokenBalance = async (account, provider): Promise<number> => {
  try {
    if (!account || !provider) {
      return;
    }

    // nufineates-link 提供的 provider 是一个扩展了 wallet connect 相关功能的 web3 provider, 它可以直接调用相关 web3 provider 方法
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
  // 我们通过调用 provider 上的 getSigner 方法来获取初始化合约 (ethers 方法) 需要的 signer
  // 这里我们使用了 kovan 上 link 的合约进行演示
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
  // 依然是生成一个合约实例
  const contract = new Contract(Link_Addr, ERC20_ABI, provider.getSigner());
  const tx = await contract.approve(Mock_Contract, APPROVE_AMOUNT, {});
  setTxHash(tx.hash);

  const receipt = await tx.wait();
  console.log(receipt, "receipt result");
};
```

如同上面所展示的, 你可以将 Nufinetes-Link 提供的 provider 当成一个具备完整功能的 web3 provider 来使用, 而之后相关合约的操作, 与你使用 MetaMask 或者其他 evm 兼容钱包所提供的 web3 provider 时别无二致.

不过 Nufinetes-Link 提供的 provider 不仅仅是一个 web3-provider, 它还同时是一额 Wallet Connect 链接实例, 接下来我们会介绍这一部分的特性

## Vechain Contract Call

在 Vechain 下, 我们需要借助 connex 来进行合约交互

```jsx
import Connex from "@vechain/connex";

// 初始化 testnet 下的 connex 实例
const connex = new Connex({
  node: "https://testnet.veblocks.net/", // veblocks public node, use your own if needed
  network: "test", // defaults to mainnet, so it can be omitted here
});
```

### Get balance of Veed

```jsx
  const balanceOfVeed = async () => {
      // declare the balanceOf abi
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

如上面所展示的, 我们只需要 Nufinetes-Link 所提供的 account 字段来传入相关合约实例进行调用, 接下来的发送合约转账请求会有一些不同

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

在 Eth 合约调用的例子里, 我们将 Nufinetes-Link provider 视为一个标准 web3 provider 进行使用. 而在 Vechain 合约调用时, 我们则可以直接将 Nufinetes-Link provider 视为一个 WalletConnect 实例来使用上面的方法
