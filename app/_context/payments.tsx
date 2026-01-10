import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import Purchases, { LOG_LEVEL, MakePurchaseResult } from 'react-native-purchases'
import { useUser } from './user'
import { Platform } from 'react-native'
import { PurchaseResult, Purchases as RevenuecatPurchases } from '@revenuecat/purchases-js'

export type PaymentsContextType = {
  purchase: ({ offering, pkgIdentifier }: { offering: string; pkgIdentifier: string }) => Promise<string | false>
}

export type PaymentsProviderProps = { children: ReactNode }

const PaymentsContext = createContext<PaymentsContextType | null>(null)

export default function PaymentsProvider({ children }: PaymentsProviderProps) {
  const { user } = useUser()
  if (!user) return <PaymentsContext.Provider value={{ purchase: null as any }}>{children}</PaymentsContext.Provider>

  const [isPurchasesReady, setIsPurchasesReady] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<any>(null)
  const [offerings, setOfferings] = useState<any>(null)

  const purchase = async ({ offering, pkgIdentifier }: { offering: string; pkgIdentifier: string }) => {
    if (!customerInfo || !offerings) {
      return false
    }

    const selectedOffering = offerings?.all?.[offering]
    const selectedPackage = selectedOffering?.availablePackages?.find((pkg: any) => pkg?.identifier === pkgIdentifier)

    if (!selectedPackage) {
      console.warn('No selected package found: ', selectedPackage)
      return false
    }

    try {
      const purchase =
        Platform.OS === 'web'
          ? await RevenuecatPurchases.getSharedInstance().purchase({
              rcPackage: selectedPackage,
            })
          : await Purchases.purchasePackage(selectedPackage)

      const transactionId = Platform.OS === 'web' ? (purchase as PurchaseResult)?.storeTransaction?.storeTransactionId : (purchase as MakePurchaseResult)?.transaction?.transactionIdentifier
      console.log('--------------------------------')
      console.log('purchase: ', purchase)
      console.log('transactionId: ', transactionId)
      console.log('--------------------------------')
      return transactionId
    } catch (e) {
      console.warn('purchase error: ', e)
    }

    return false
  }

  useEffect(() => {
    if (isPurchasesReady) return

    const fn = async () => {
      let p = null

      if (Platform.OS === 'web') {
        p = await RevenuecatPurchases.configure({
          apiKey: process.env.EXPO_PUBLIC_REVENUECAT_TEST_STORE_API_KEY as string,
          appUserId: user?.customerId as string,
        })
      } else {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE)

        if (Platform.OS === 'android') {
          Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_PLAY_STORE_API_KEY as string, appUserID: user?.customerId })
        } else if (Platform.OS === 'ios') {
          Purchases.configure({ apiKey: '' as string, appUserID: user?.customerId })
        }
      }

      setIsPurchasesReady(true)
    }

    fn()
  }, [])

  useEffect(() => {
    if (!isPurchasesReady) return

    const fn = async () => {
      if (Platform.OS === 'web') {
        const i = await RevenuecatPurchases.getSharedInstance().getCustomerInfo()
        setCustomerInfo(i)

        const o = await RevenuecatPurchases.getSharedInstance().getOfferings()
        setOfferings(o)
      } else if (['android', 'ios'].includes(Platform.OS)) {
        const i = await Purchases.getCustomerInfo()
        setCustomerInfo(i)

        const o = await Purchases.getOfferings()
        setOfferings(o)
      }
    }

    fn()
  }, [isPurchasesReady])

  useEffect(() => {
    console.log('customerInfo: ', customerInfo)
    console.log('offerings: ', offerings)

    if (!customerInfo || !offerings) {
      return
    }

    const fn = async () => {
      // console.log('purchasing')
      const transaction = await purchase({ offering: 'TEST', pkgIdentifier: '$rc_monthly' })
      // console.log('transaction: ', transaction)
      // purchase({ offering: 'lifetime', pkgIdentifier: '$rc_lifetime' })
    }

    fn()
  }, [customerInfo, offerings])

  return <PaymentsContext.Provider value={{ purchase }}>{children}</PaymentsContext.Provider>
}

export const usePayments = () => {
  const context = useContext(PaymentsContext)
  if (!context) throw new Error("usePayments can't be null")
  return context
}
