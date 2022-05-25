import Link from 'next/link'
import Header from '../components/Header'
import MetamaskSign from '../components/signComponents/MetamaskSign'
import NefinetesSign from '../components/signComponents/NufinetesSign'
import ProviderExample from '../components/ProviderExample'

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: 'center' }}>
        Eth 签名示例
        <br />
        本示例提供了两个面板用来分别演示 Nufinetes 和 MetaMask 的签名功能, 在钱包地址相同并且签名内容相同的情况下,
        签名的结果应该都是一致的
      </div>

      <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
        <NefinetesSign />
        <MetamaskSign />
      </div>
    </div>
  )
}
