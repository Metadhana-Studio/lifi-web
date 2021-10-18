import { chainKeysToObject, TransferStep, Wallet } from '../types';

const isSupported = () => {
  try {
    var itemBackup = localStorage.getItem("");
    localStorage.removeItem("");
    if (itemBackup === null)
      localStorage.removeItem("");
    else
      localStorage.setItem("", itemBackup);
    return true;
  }
  catch (e) {
    return false;
  }
}

const clearLocalStorage = () => {
  if (isSupported()) {
    localStorage.clear()
  }
}

const storeWallets = (wallets: Array<Wallet>) => {
  if (isSupported()) {
    localStorage.setItem('wallets', JSON.stringify(wallets.map(item => item.address)))
  }
}

const readWallets = (): Array<Wallet> => {
  if (!isSupported()) {
    return []
  }

  const walletsString = localStorage.getItem('wallets')
  if (walletsString) {
    try {
      const addresses = JSON.parse(walletsString)
      return addresses.map((address: string) => {
        return {
          address: address,
          loading: false,
          portfolio: chainKeysToObject([]),
        }
      })
    }
    catch (e) {
      return []
    }
  } else {
    return []
  }
}

const storeNxtpMessagingToken = (token: string, account: string) => {
  if (isSupported()) {
    localStorage.setItem('nxtpMessagingToken', token + ':' + account)
  }
}

const readNxtpMessagingToken = () => {
  if (!isSupported()) {
    return null
  }
  const value = localStorage.getItem('nxtpMessagingToken')
  if (!value) {
    return null
  }
  const parts = value.split(':')
  return {
    token: parts[0],
    account: parts.length > 1 && parts[1] ? parts[1] : null
  }
}

const storeHideAbout = (hide: boolean) => {
  if (isSupported()) {
    localStorage.setItem('nxtpHideDemo', hide ? 'true' : 'false')
  }
}

const readHideAbout = () => {
  if (!isSupported()) {
    return true
  }
  const value = localStorage.getItem('nxtpHideDemo')
  return !(value === 'false')
}


const storeActiveRoute = (route: TransferStep[]) => {
  if (!isSupported()) return
  const storedRoutes = readActiveRoutes()
  const newFirstStep = route[0]
  const newLastStep = route[ route.length-1 ]
  let updatedRoutes
  if(!storedRoutes.length){
    updatedRoutes = [route]
  } else {
    updatedRoutes = storedRoutes.map(storedRoute => {
      const storedFirstStep = route[0]
      const storedLastStep = route[ route.length-1 ]
      if(storedFirstStep.action === newFirstStep.action && storedLastStep.action === newLastStep.action){
        storedRoute = route
      }
      return storedRoute
    })
  }


  localStorage.setItem('activeRoute', JSON.stringify(updatedRoutes, (k, v) =>
    typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v,
  ))
}

const deleteActiveRoute = (route: TransferStep[]) => {
  if (!isSupported()) {
    return
  }
  const storedRoutes = readActiveRoutes()
  if(storedRoutes && storedRoutes.length < 2) return localStorage.removeItem('activeRoute')
  const newFirstStep = route[0]
  const newLastStep = route[ route.length-1 ]
  const updatedRoutes = storedRoutes.map(storedRoute => {
    const storedFirstStep = route[0]
    const storedLastStep = route[ route.length-1 ]
    if(storedFirstStep.action !== newFirstStep.action && storedLastStep.action !== newLastStep.action){
      return storedRoute
    }
    return null
  })

  localStorage.setItem('activeRoute', JSON.stringify(updatedRoutes, (k, v) =>
    typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v,
  ))
}

const readActiveRoutes =(): Array<TransferStep[]> => {
  if (!isSupported()) {
    return [] as Array<TransferStep[]>
  }
  const routeString = localStorage.getItem('activeRoute')

  if (routeString) {
    try {
      // deserialize all JSX elements correctly
      const route = JSON.parse(routeString, (k, v) => {
        const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/);

        return matches ? Symbol.for(matches[1]) : v;
      })
      return route as Array<TransferStep[]>
    }
    catch (e) {
      return [] as Array<TransferStep[]>
    }
  } else {
    return [] as Array<TransferStep[]>
  }
}

export {
  isSupported,
  clearLocalStorage,
  storeWallets,
  readWallets,
  storeNxtpMessagingToken,
  readNxtpMessagingToken,
  storeHideAbout,
  readHideAbout,
  storeActiveRoute,
  deleteActiveRoute,
  readActiveRoutes
}
