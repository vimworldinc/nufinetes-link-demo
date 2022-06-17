import Header from '../components/Header'
import MetamaskSign from '../components/signComponents/MetamaskSign'
import NefinetesSign from '../components/signComponents/NufinetesSign'

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: 'center' }}>
        Eth Sign Examples
        <br />
        This example provides two panels to demonstrate the signature function of Nufinetes and MetaMask respectively. When the wallet address is the same and the signature content is the same, the signature results should be consistent
      </div>

      <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
        <NefinetesSign />
        <MetamaskSign />
      </div>
    </div>
  )
}
