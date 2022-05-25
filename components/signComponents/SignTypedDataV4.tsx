import { useState } from 'react'
import styled from 'styled-components'
import { recoverTypedSignature, SignTypedDataVersion } from '@metamask/eth-sig-util'

const PersonalSign = ({ provider, account, type }) => {
  const [sigRes, setSigRes] = useState('')
  const [recoverRes, setRecoverRes] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const signData = {
    domain: {
      name: 'Ether Mail',
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      version: '1',
    },
    message: {
      contents: 'Hello, Bob!',
      from: {
        name: 'Cow',
        wallets: ['0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'],
      },
      to: [
        {
          name: 'Bob',
          wallets: [
            '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
            '0xB0B0b0b0b0b0B000000000000000000000000000',
          ],
        },
      ],
    },
    primaryType: 'Mail' as const,
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Group: [
        { name: 'name', type: 'string' },
        { name: 'members', type: 'Person[]' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person[]' },
        { name: 'contents', type: 'string' },
      ],
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallets', type: 'address[]' },
      ],
    },
  }

  const handleSendRequest = () => {
    const msgParams = [account, JSON.stringify(signData)]

    if (!provider?.request) {
      setErrorMessage('Provider does not support Eth signs')
      return
    }
    provider.request({ method: 'eth_signTypedData_v4', params: msgParams }).then((res) => setSigRes(res))
  }

  const handleRecover = async () => {
    if (!sigRes) {
      return
    }
    const recoveredAddress = await recoverTypedSignature({
      data: signData,
      signature: sigRes,
      version: SignTypedDataVersion.V4,
    })
    setRecoverRes(recoveredAddress)
  }

  return (
    <Wrapper className={type}>
      <h4>Sign Typed Data V4</h4>

      <StyledResult>{`
          message: {
            contents: 'Hello, Bob!',
            from: {
              name: 'Cow',
              wallets: ['0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'],
            },
            to: [
              {
                name: 'Bob',
                wallets: [
                  '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                  '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                  '0xB0B0b0b0b0b0B000000000000000000000000000',
                ],
              },
            ],
          },
      `}</StyledResult>
      <StyledButton onClick={handleSendRequest}>Sign Typed Data V4</StyledButton>
      <StyledLabel>Sign Result</StyledLabel>
      <StyledResult>{sigRes || ''}</StyledResult>
      <StyledButton onClick={handleRecover}>Recover signature</StyledButton>
      <StyledLabel>Recover Result</StyledLabel>
      <StyledResult className="recover">{recoverRes || ''}</StyledResult>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </Wrapper>
  )
}

export default PersonalSign

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  width: 280px;
  margin-top: 20px;
  padding-top: 0;

  &.nufinetes {
    background: #caf7ff;
  }
  &.metamask {
    background: #ffebb4;
  }

  h4 {
    margin: 12px auto;
  }
`

const StyledButton = styled.button`
  width: 100%;
  margin-bottom: 12px;
  margin-top: 12px;
`

const StyledLabel = styled.div`
  width: 100%;
  text-align: left;
  font-size: 12px;
`

const StyledResult = styled.div`
  width: 100%;
  min-height: 120px;
  background-color: #dbdbdb;
  padding: 10px;
  font-size: 14px;
  word-wrap: break-word;
  box-sizing: border-box;
  border-radius: 8px;

  &.recover {
    min-height: 80px;
  }
`
