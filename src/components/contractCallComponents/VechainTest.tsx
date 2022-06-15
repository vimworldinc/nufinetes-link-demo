import {formatUnits} from 'ethers/lib/utils'
import {useEffect, useState} from 'react'
import {hooks, nufinetes} from '../../connectors/nufinetes'
import {Accounts} from '../Accounts'
import {Card} from '../Card'
import {Chain} from '../Chain'
import {Status} from '../Status'
import BigNumber from 'bignumber.js'
import * as Devkit from 'thor-devkit'
import Connex from '@vechain/connex'

const {useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider} = hooks

const Veed_Addr = '0xa39a4b2e23220305083e2e7c94c8950ef1e641c6'
export const GAS_LIMIT_COSTS = 1000

const connex = new Connex({
    node: 'https://testnet.veblocks.net/', // veblocks public node, use your own if needed
    network: 'test', // defaults to mainnet, so it can be omitted here
})

export default function NefinetesCard() {
    const chainId = useChainId()
    const accounts = useAccounts()
    const error = useError()
    const isActivating = useIsActivating()
    const _isActive = useIsActive()
    const isActive = accounts && _isActive

    const provider = useProvider()

    const [veedBalance, setVeedBalance] = useState(0)
    const [amountValue, setAmountValue] = useState('')
    const [address, setAddress] = useState('')
    const [txHash, setTxHash] = useState('')
    // const ENSNames = useENSNames(provider)
    // attempt to connect eagerly on mount
    // console.log(nufinetes.provider.uri)
    useEffect(() => {
        void nufinetes.connectEagerly()
    }, [])

    const balanceOfVeed = async () => {
        if (typeof self === 'undefined') {
            return
        }

        const balanceOfABI = {
            constant: true,
            inputs: [{name: '_owner', type: 'address'}],
            name: 'balanceOf',
            outputs: [{name: 'balance', type: 'uint256'}],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        }

        const acc = connex.thor.account(Veed_Addr)
        const method = acc.method(balanceOfABI)
        const result = await method.call(accounts[0])
        const fnABI = new Devkit.abi.Function(balanceOfABI as Devkit.abi.Function.Definition)
        const balanceRes = fnABI.decode(result.data)
        setVeedBalance(balanceRes.balance / 1e18)
    }

    const contractRequest = async (params): Promise<{txid: string}> => {
        const {address, clauseList} = params
        console.log({clauseList, str: JSON.stringify(clauseList)})
        try {
            const transferTokenJSON = {
                id: 1,
                jsonrpc: '2.0',
                method: 'vechain_transaction',
                params: [
                    clauseList,
                    {
                        broadcast: true,
                        chainId: (provider as any).chainId,
                        signer: address,
                    },
                ],
            }
            console.log({transferTokenJSON, str: JSON.stringify(transferTokenJSON)})
            const res = await (provider as any).sendCustomRequest(transferTokenJSON)
            console.log({signRes: res})
            return res
        } catch (error) {
            console.log({error})
            console.log({sendCustomRequest: error.message})
            return Promise.reject(error.message || 'Payment failed')
        }
    }

    const transferVeed = async () => {
        if (!amountValue || Number.isNaN(+amountValue)) {
            alert('Please input number')
            return
        } else if (!address) {
            alert('Please input receiver address')
            return
        }

        const transferABI = {
            constant: false,
            inputs: [
                {name: '_to', type: 'address'},
                {name: '_amount', type: 'uint256'},
            ],
            name: 'transfer',
            outputs: [{name: 'success', type: 'bool'}],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        }

        const big = BigInt(parseFloat(amountValue) * Math.pow(10, 18))
        const bigNum = new BigNumber(big.toString())

        const params = [address, big.toString()]

        const clauseParams = connex.thor
            .account(Veed_Addr)
            .method(transferABI)
            .asClause(...params)

        const clause = [{comment: `Transfer ${amountValue} VEED`, ...clauseParams}]

        const signRes = await contractRequest({
            address: accounts[0].toLocaleLowerCase(),
            comment: `Transfer ${amountValue} VEED`,
            clauseList: clause,
        })

        if (signRes && signRes.txid) {
          setTxHash(signRes.txid)
        }
    }

    return (
        <Card>
            <div>
                <b>Nufinetes</b>
                <Status isActivating={isActivating} error={error} isActive={isActive} />
                <div style={{marginBottom: '1rem'}} />
                <Chain chainId={chainId} />
                <Accounts accounts={accounts} />
            </div>
            <div style={{marginBottom: '1rem'}} />

            {!isActive && <button onClick={() => nufinetes.activate(42)}>Connect</button>}

            {isActive && <button onClick={() => nufinetes.deactivate()}>Disconnect</button>}

            {chainId === 818000001 ? (
                <>
                    {' '}
                    <button onClick={balanceOfVeed}>Get Balance of Veed</button>
                    <div>Veed Balance: {veedBalance}</div>
                    <div style={{wordBreak: 'break-all'}}>Tx Hash: </div>
                    <div style={{marginTop: 10}}>Veed Contract Address: </div>
                    <div>{Veed_Addr}</div>
                    <div style={{marginTop: 10}}>
                        <span>Input Veed Amount</span>
                        <br />
                        <input
                            style={{width: '100%', height: 30}}
                            type="text"
                            value={amountValue}
                            onChange={(e) => setAmountValue(e.target.value)}
                        />
                    </div>
                    <div style={{margin: '10px 0'}}>
                        <span>Input Receiver Address</span>
                        <br />
                        <input
                            style={{width: '100%', height: 30}}
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <button onClick={transferVeed}>Transfer Veed</button>

                    <div style={{ wordBreak: 'break-all' }}>Tx Hash: {txHash}</div>
                </>
            ) : (
                <span
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 10,
                        textAlign: 'center',
                    }}
                >
                    Please Switch to Vechain Testnet on Nufinetes
                </span>
            )}
        </Card>
    )
}
