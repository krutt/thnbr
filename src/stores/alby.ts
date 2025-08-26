/* ~~/src/stores/alby.ts */

export const useAlby = defineStore('alby', () => {
  // refs
  const address: Ref<string> = ref('')
  const derivationPath: Ref<string> = ref('')
  const publicKey: Ref<string> = ref('')

  // funcs
  const connectWallet = async () => {
    // if (typeof window.webbtc !== 'undefined') {
    //   await window.webbtc.enable()
    //   let response = await window.webbtc.getAddress()
    //   storeAddress(response.address)
    //   storeDerivationPath(response.derivationPath)
    //   storePublicKey(response.publicKey)
    //   toast.success('Connected', {
    //     description: 'Successfully connected Alby Wallet Extension',
    //   })
    // }
  }

  const storeAddress = (value) => {
    address.value = value
    localStorage.setItem('address', value)
  }

  const storeDerivationPath = (value) => {
    derivationPath.value = value
    localStorage.setItem('derivationPath', value)
  }

  const storePublicKey = (value) => {
    publicKey.value = value
    localStorage.setItem('publicKey', value)
  }

  const unsetAddress = () => {
    address.value = null
    localStorage.removeItem('address')
  }
  const unsetDerivationPath = () => {
    derivationPath.value = null
    localStorage.removeItem('derivationPath')
  }
  const unsetPublicKey = () => {
    publicKey.value = null
    localStorage.removeItem('publicKey')
  }

  return {
    address,
    connectWallet,
    derivationPath,
    publicKey,
    storeAddress,
    storeDerivationPath,
    storePublicKey,
    unsetAddress,
    unsetDerivationPath,
    unsetPublicKey,
  }
})

export default useAlby
