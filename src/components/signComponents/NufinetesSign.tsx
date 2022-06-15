import { useEffect } from 'react'
import { hooks, nufinetes } from '../../connectors/nufinetes'
import { Accounts } from '../Accounts'
import { Card } from '../Card'
import { Chain } from '../Chain'
import { ConnectWithSelect } from '../ConnectWithSelect'
import { Status } from '../Status'
import PersonalSign from './PersonalSign'
import SignTypedDataV4 from './SignTypedDataV4'

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

      <PersonalSign account={accounts?.[0]} provider={provider?.provider} type="nufinetes" />
      <SignTypedDataV4 account={accounts?.[0]} provider={provider?.provider} type="nufinetes" />
    </Card>
  )
}
