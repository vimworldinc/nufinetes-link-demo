import { useEffect } from 'react'
import { hooks, walletConnect } from '../../connectors/walletConnect'
import { Accounts } from '../Accounts'
import { Card } from '../Card'
import { Chain } from '../Chain'
import { ConnectWithSelect } from '../ConnectWithSelect'
import { Status } from '../Status'

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export default function WalletConnectCard() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const error = useError()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const handleSendRequest = () => {
    const signParams = {
      id: 1,
      jsonrpc: '2.0',
      method: 'vechain_certificate',
      params: [
        {
          cert: JSON.stringify({
            purpose: 'identification',
            payload: {
              type: 'text',
              content: '112232344',
            },
            domain: window.location.origin,
          }),
        },
      ],
    }

    if ((provider as any).sendCustomRequest) {
      ;(provider as any).sendCustomRequest(signParams)
    } else {
      console.log(
        (provider.provider as any).request,
        (provider.provider as any)
          .request({ method: 'personal_sign', params: ['check sign', accounts[0], 'example'] })
          .then((res) => console.log(res))
      )
    }
  }

  // attempt to connect eagerly on mount
  useEffect(() => {
    void walletConnect.connectEagerly()
  }, [])

  return (
    <Card>
      <div>
        <b>WalletConnect</b>
        <Status isActivating={isActivating} error={error} isActive={isActive} />
        <div style={{ marginBottom: '1rem' }} />
        <Chain chainId={chainId} />
        <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      </div>
      <div style={{ marginBottom: '1rem' }} />
      <ConnectWithSelect
        connector={walletConnect}
        chainId={chainId}
        isActivating={isActivating}
        error={error}
        isActive={isActive}
      />
      <button onClick={() => console.log(provider)}>Check provider</button>
      <button onClick={handleSendRequest}>Check provider</button>
    </Card>
  )
}
