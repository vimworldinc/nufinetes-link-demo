import { useState } from 'react'
import styled from 'styled-components'
import { recoverPersonalSignature } from '@metamask/eth-sig-util'

const PersonalSign = ({ provider, account, type }) => {
  const [sigRes, setSigRes] = useState('')
  const [recoverRes, setRecoverRes] = useState('')
  const [signMessage, setSignMessage] = useState('Example `personal_sign` message')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSendRequest = () => {
    const msgParams = [signMessage, account]

    if (!provider?.request) {
      setErrorMessage('Provider does not support Eth signs')
      return
    }

    provider.request({ method: 'personal_sign', params: msgParams }).then((res) => setSigRes(res))
  }

  const handleRecover = async () => {
    if (!sigRes) {
      return
    }
    const recoveredAddress = await recoverPersonalSignature({
      data: signMessage,
      signature: sigRes,
    })
    setRecoverRes(recoveredAddress)
  }

  const handleChange = (e) => {
    setSignMessage(e.target.value)
  }

  return (
    <Wrapper className={type}>
      <h4>Personal Sign</h4>
      <StyledInput value={signMessage} onChange={handleChange} />
      <StyledButton onClick={handleSendRequest}>Personal Sign</StyledButton>
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

const StyledInput = styled.textarea`
  width: 100%;
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
