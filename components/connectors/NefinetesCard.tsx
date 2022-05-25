import { useEffect } from 'react'
import { hooks, nufinetes } from '../../connectors/nufinetes'
import { Accounts } from '../Accounts'
import { Card } from '../Card'
import { Chain } from '../Chain'
import { ConnectWithSelect } from '../ConnectWithSelect'
import { Status } from '../Status'

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks

export default function NefinetesCard() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const error = useError()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  // const ENSNames = useENSNames(provider)
  // attempt to connect eagerly on mount
  useEffect(() => {
    void nufinetes.connectEagerly()
  }, [])

  const handleSendRequest = () => {
    if ((provider as any).sendCustomRequest) {
      console.log(provider, 'check provider')
      const message = { data: '0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765' }

      const msgParams = {
        id: 1,
        jsonrpc: '2.0',
        method: 'personal_sign',
        params: ['Example `personal_sign` message', '0x639c55cb0053974b273446043353a9918eccb00c'],
      }
      
      ;(provider as any).sendCustomRequest(msgParams).then((res) => console.log(res))
    } else {
      const message = { data: '0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765' }

      const msgParams = ['Example `personal_sign` message', '0x639c55cb0053974b273446043353a9918eccb00c']
      console.log(
        (provider.provider as any).request,
        (provider.provider as any)
          .request({ method: 'personal_sign', params: msgParams })
          .then((res) => console.log(res))
      )
    }
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
      <ConnectWithSelect
        connector={nufinetes}
        chainId={chainId}
        isActivating={isActivating}
        error={error}
        selectable={false}
        isActive={isActive}
      />
      <button onClick={() => console.log(provider, nufinetes.customProvider)}>Check provider</button>
      <button onClick={handleSendRequest}>SIGN</button>
    </Card>
  )
}
