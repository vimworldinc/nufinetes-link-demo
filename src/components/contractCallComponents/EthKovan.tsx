import { formatUnits } from 'ethers/lib/utils'
import { Contract } from '@ethersproject/contracts'
import { useEffect, useState } from 'react'
import { hooks, nufinetes } from '../../connectors/nufinetes'
import { Accounts } from '../Accounts'
import { Card } from '../Card'
import { Chain } from '../Chain'
import { ConnectWithSelect } from '../ConnectWithSelect'
import { Status } from '../Status'
import ERC20_ABI from './erc20.json'

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks

const Link_Addr = '0xa36085F69e2889c224210F603D836748e7dC0088'
const Mock_Contract = '0xdd612965659fe530869f9e224286d232334b4bd3'
const Link_Faucet = 'https://faucets.chain.link/'
export const GAS_LIMIT_COSTS = 1000
export default function NefinetesCard() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const error = useError()
  const isActivating = useIsActivating()
  const _isActive = useIsActive()
  const isActive = accounts && _isActive

  const provider = useProvider()

  const [ethBalance, setEthBalance] = useState(0)
  const [linkBalance, setLinkBalance] = useState(0)
  const [approvedAmount, setApprovedAmount] = useState(0)
  const [txHash, setTxHash] = useState('')
  console.log(provider, error, 'check provider')
  // const ENSNames = useENSNames(provider)
  // attempt to connect eagerly on mount
  // console.log(nufinetes.provider.uri)
  useEffect(() => {
    void nufinetes.connectEagerly()
  }, [])

  const getNativeTokenBalance = async (account, provider) => {
    try {
      if (!account || !provider) {
        return
      }
      const _balance = await provider.getBalance(account)
      if (+_balance || +_balance === 0) {
        return +formatUnits(_balance, 18)
      }
      return null
    } catch (error) {
      console.log(error, 'check balance error')
      return null
    }
  }

  const APPROVE_AMOUNT = '0xffffff'

  const handleBalanceAndApprove = async () => {
    // ;(provider as any).sendCustomRequest(signParams)
    // return
    const balance = await getNativeTokenBalance(accounts[0], provider)
    // console.log(balance, 'check balance')
    setEthBalance(balance)

    const contract = new Contract(Link_Addr, ERC20_ABI, provider.getSigner())
    const _balance = await contract.balanceOf(accounts[0])
    const _decimals = await contract.decimals()

    console.log(+formatUnits(_balance, _decimals), 'check clink')
    setLinkBalance(+formatUnits(_balance, _decimals))

    const addressApprowed = await contract.allowance(accounts[0], Mock_Contract, {
      gasLimit: 1000000,
    })
    setApprovedAmount(Number(addressApprowed))
  }

  const getApprove = async () => {
    const contract = new Contract(Link_Addr, ERC20_ABI, provider.getSigner())

    const tx = await contract.approve(Mock_Contract, APPROVE_AMOUNT, {})
    console.log(tx, 'check tx')
    setTxHash(tx.hash)
    const receipt = await tx.wait()
  }

  return (
    <Card>
      <div>
        <b>Nufinetes</b>
        <Status isActivating={isActivating} error={error} isActive={isActive} />
        <div style={{ marginBottom: '1rem' }} />
        <Chain chainId={chainId} />
        <Accounts accounts={accounts} />
      </div>
      <div style={{ marginBottom: '1rem' }} />

      {!isActive && <button onClick={() => nufinetes.activate(42)}>Connect</button>}

      {isActive && <button onClick={() => nufinetes.deactivate()}>Disconnect</button>}

      {chainId === 42 ? (
        <>
          {' '}
          <button onClick={handleBalanceAndApprove}>Get Balance And Approve</button>
          <div>Eth Balance: {ethBalance}</div>
          <div>Link Balance: {linkBalance}</div>
          <div>Link Approve: {approvedAmount}</div>
          <button onClick={getApprove}>Get Approve</button>
          <div style={{ wordBreak: 'break-all' }}>Tx Hash: {txHash}</div>
          <div style={{ marginTop: 10 }}>Link Contract Address: </div>
          <div>{Link_Addr}</div>
          <div style={{ color: 'green' }}>Link Faucet Address: </div>
          <a href={Link_Faucet} rel="noreferrer" target="_blank">
            {Link_Faucet}
          </a>
        </>
      ) : (
        <span style={{ display: 'flex', justifyContent: 'center', marginTop: 10, textAlign: 'center' }}>
          Please Switch to Eth Kovan Testnet on Nufinetes
        </span>
      )}
    </Card>
  )
}
