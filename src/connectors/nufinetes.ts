import { initializeConnector } from '@web3-react/core'
import { NufinetesConnector } from '@vimworldinc/nufinetes-link'
import { URLS } from '../chains'
console.log(Object.keys(URLS).reduce((accumulator, chainId) => {
  accumulator[chainId] = URLS[Number(chainId)][0]
  return accumulator
}, {}))
export const [nufinetes, hooks] = initializeConnector<NufinetesConnector>(
  (actions) =>
    new NufinetesConnector(actions, {
      rpc: Object.keys(URLS).reduce((accumulator, chainId) => {
        accumulator[chainId] = URLS[Number(chainId)][0]
        return accumulator
      }, {}),
    }),
  [1, 2, 3, 4, 42, 818000000, 818000001]
)
