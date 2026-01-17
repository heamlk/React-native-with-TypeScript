import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import Purchases, { LOG_LEVEL, MakePurchaseResult } from 'react-native-purchases'
import { useUser } from './user'
import { Platform } from 'react-native'
import { PurchaseResult, Purchases as RevenuecatPurchases } from '@revenuecat/purchases-js'
import { useApi } from './api'
import storage from '../_shared/storage/storage'
import { findKeyWithValue } from '../_lib/utils'

export const PRODUCT_IDENTIFYERS = {
  lifetime: {
    lifetime_subscription: ['lifetime_asd', 'prod_R8dMiUsbVeJ75e', 'lifetime'],
  },
  subscription: {
    additional_ai: ['subscription_monthly', 'prod_Py4Ja13mrS8EKZ', 'monthly_subscription:monthly-subscription'],
    advanced_animation: ['test_advanced_animation', 'advanced_animation', 'advanced_animation:advanced-animation'],
    nsfw_capability: ['test_nsfw_capability', 'nsfw_capability', 'nsfw_capability:nsfw_capability'],
    text_2_voice: ['test_advanced_voices', 'prod_RLImEoMNQqKwcJ', 'advanced_voices:advanced-voices'],
  },
  purchases: {
    anime_universe: ['test_anime_universe', 'anime_universe', 'anime_universe'],
    goth_universe: ['test_goth_universe', 'goth_universe', 'goth_universe'],
    neon_universe: ['test_neon_glow_niverse', 'neon_glow_niverse', 'neon_glow_niverse'],
    fashion_universe: ['test_fashion_universe', 'fashion_universe', 'fashion_universe'],
  },
}

export type PaymentsContextType = {
  purchase: ({ offering, pkgIdentifier }: { offering: string; pkgIdentifier: string }) => Promise<string | false>
}

export type PaymentsProviderProps = { children: ReactNode }

const PaymentsContext = createContext<PaymentsContextType | null>(null)

export default function PaymentsProvider({ children }: PaymentsProviderProps) {
  const { user } = useUser()
  const { api } = useApi()
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
      const productId = Platform.OS === 'web' ? (purchase as PurchaseResult)?.storeTransaction?.productIdentifier : (purchase as MakePurchaseResult)?.transaction?.productIdentifier
      console.log('--------------------------------')
      console.log('purchase: ', purchase)
      console.log('transactionId: ', transactionId)
      console.log('--------------------------------')

      api.post(
        'revenuecat/validate-purchase',
        {
          transaction_id: transactionId,
          platform: Platform.OS,
          product_id: productId,
        },
        {
          headers: {
            'x-session-token': (storage.getString('session') as any) || '',
          },
        }
      )

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
          apiKey: process.env.EXPO_PUBLIC_REVENUECAT_SANDBOX_WEB_BILLING_API_KEY as string,
          appUserId: user?.customerId as string,
        })
      } else {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE)

        if (Platform.OS === 'android') {
          Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_PLAY_STORE_API_KEY as string, appUserID: user?.customerId })
        } else if (Platform.OS === 'ios') {
          Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_STORE_API_KEY as string, appUserID: user?.customerId })
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

  // useEffect(() => {
  //   console.log('user: ', user)
  //   console.log('customerInfo: ', customerInfo)
  //   console.log('offerings: ', offerings)

  //   if (!user || !customerInfo || !offerings) {
  //     return
  //   }

  //   // Checking if user have un-validated purchases
  //   const fn = async () => {
  //     const revenuecatSubscriptionKeys = Object.keys(customerInfo?.subscriptionsByProductIdentifier)
  //       .filter((key) => customerInfo?.subscriptionsByProductIdentifier?.[key]?.isActive === true)
  //       ?.filter(Boolean)
  //     const revenuecatPurchaseKeys = customerInfo?.nonSubscriptionTransactions?.map((obj: any) => obj?.productIdentifier)?.filter(Boolean)

  //     revenuecatSubscriptionKeys?.forEach((key) => {
  //       const bfflKey = findKeyWithValue(PRODUCT_IDENTIFYERS.subscription, key)
  //       const userHaveBfflKey = !!user?.profile?.subscription?.options?.bfflKey

  //       if(!userHaveBfflKey){
  //         const revCatProduct = customerInfo?.subscriptionsByProductIdentifier?.
  //       }

  //       // console.log('bfflKey: ', bfflKey)
  //       // if(user?.profile?.subscription?.options)
  //     })

  //     console.log('revenuecatSubscriptionKeys: ', revenuecatSubscriptionKeys)
  //     console.log('revenuecatPurchaseKeys: ', revenuecatPurchaseKeys)
  //   }

  //   fn()
  // }, [user, customerInfo, offerings])

  return <PaymentsContext.Provider value={{ purchase }}>{children}</PaymentsContext.Provider>
}

export const usePayments = () => {
  const context = useContext(PaymentsContext)
  if (!context) throw new Error("usePayments can't be null")
  return context
}
