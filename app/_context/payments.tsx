import { Dispatch, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases'
import { useUser } from './user'
import { Platform } from 'react-native'
import { Purchases as RevenuecatPurchases } from '@revenuecat/purchases-js'

export type PaymentsContextType = {
  payments: null | any
  purchase: ({ offering, pkgIdentifier }: { offering: string; pkgIdentifier: string }) => Promise<string | false>
}

export type PaymentsProviderProps = { children: ReactNode }

const PaymentsContext = createContext<PaymentsContextType | null>(null)

export default function PaymentsProvider({ children }: PaymentsProviderProps) {
  const { user } = useUser()
  if (!user) return <PaymentsContext.Provider value={{ payments: null as any, purchase: null as any }}>{children}</PaymentsContext.Provider>

  const [payments, setPayments] = useState<any>(null)
  const [customerInfo, setCustomerInfo] = useState<any>(null)
  const [offerings, setOfferings] = useState<any>(null)

  useEffect(() => {
    const fn = async () => {
      let p = null

      if (Platform.OS === 'web') {
        p = await RevenuecatPurchases.configure({
          apiKey: process.env.EXPO_PUBLIC_REVENUECAT_WEB_BILLING_API_KEY as string,
          appUserId: user?.customerId as string,
        })
      }
      // else if (Platform.OS === 'android') {
      //   p = await Purchases.configure({
      //     apiKey: process.env.EXPO_PUBLIC_REVENUECAT_PLAY_STORE_API_KEY as string,
      //     appUserID: user?.customerId,
      //   })
      // }

      setPayments(p)
    }

    fn()
  }, [])

  useEffect(() => {
    if (!payments) return

    const fn = async () => {
      const i = await RevenuecatPurchases.getSharedInstance().getCustomerInfo()
      setCustomerInfo(i)

      const o = await RevenuecatPurchases.getSharedInstance().getOfferings()
      setOfferings(o)
    }

    fn()
  }, [payments])

  // useEffect(() => {
  //   console.log('customerInfo: ', customerInfo)
  //   console.log('offerings: ', offerings)

  //   if (!customerInfo || !offerings) {
  //     return
  //   }

  //   const fn = async () => {
  //     const customerInfo = await RevenuecatPurchases.getSharedInstance().getCustomerInfo()
  //     console.log('customerInfo: ', customerInfo)
  //   }
  // }, [customerInfo, offerings])

  const purchase = async ({ offering, pkgIdentifier }: { offering: string; pkgIdentifier: string }) => {
    if (!customerInfo || !offerings) {
      return false
    }

    const selectedOffering = offerings?.all?.[offering]
    const selectedPackage = selectedOffering?.availablePackages?.find((pkg: any) => pkg?.identifier === pkgIdentifier)

    if (!selectedPackage) {
      return false
    }

    try {
      const purchase = await RevenuecatPurchases.getSharedInstance().purchase({
        rcPackage: selectedPackage,
      })
      const transactionId = purchase?.storeTransaction?.storeTransactionId
      return transactionId
    } catch (e) {
      console.warn(e)
    }

    return false
  }

  return <PaymentsContext.Provider value={{ payments, purchase }}>{children}</PaymentsContext.Provider>
}

export const usePayments = () => {
  const context = useContext(PaymentsContext)
  if (!context) throw new Error("usePayments can't be null")
  return context
}
