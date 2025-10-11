export type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
export type RequestContentType = 'application/json' | 'multipart/form-data'

export type ChatParticipant = 'customer' | 'companion' | 'system'

export interface BaseChatMessage {
  role: ChatParticipant
  localMessageId?: string
  createdAt: Date
}

export interface TextChatMessage extends BaseChatMessage {
  type: 'text'
  content: string
}

export interface ImageChatMessage extends BaseChatMessage {
  type: 'image'
  content: string
  mediaId?: string
}

export type ChatMessage = TextChatMessage | ImageChatMessage

export interface CustomerInfos {
  profile: CustomerProfile
  companions: CompanionInfos[]
}

export interface CustomerPersonalInfos {
  firstName: string
  lastName: string
  birthdate: string
  avatar?: File
  interests: string[]
}

export interface ConfirmAccountInfos extends CustomerPersonalInfos {
  username: string
  referralCode: string
}

export interface CreateCustomerData {
  username: string
  email: string
  password: string
}

export interface Subscription {
  status: string
  startDate: Date
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  options?: Record<string, SubscriptionOption>
}

export interface SubscriptionOption {
  cancelAtPeriodEnd: boolean
  activeUntil: Date
}

export interface Purchase {
  createdAt: Date
}

export interface CustomerProfile {
  email: string
  isSubscribed: boolean
  username?: string
  firstName?: string
  lastName?: string
  birthdate?: Date
  address?: Address
  interests?: string[]
  avatar?: string
  lifetimeSubscription: boolean
  subscription?: Subscription
  purchases?: Record<string, Purchase>
  isAgeVerified: boolean
  nsfwDisabledSince?: Date
  personalReferralCode?: string
  isStripeAccountSetup: boolean
  animationGenerationQuota: number
}

export interface Address {
  street: string
  city: string
  state: string
  zip: string
}

export interface CompanionAttributes {
  name: string
  age: number
  gender: string
  hairColor: string
  hairLength: string
  eyeColor: string
  skinTone: string
  facialHair?: string
  attire: string
  universe: string
  personality: string
  ancestralRegion: string
}

export interface ImageMedia {
  id: string
  createdAt: Date
  image: string
  thumbnail: string
  isNSFW: boolean
  animationUrl?: string
  animationGenerationStatus?: string
}

export interface CompanionMedia {
  images: ImageMedia[]
}

export interface CompanionInfos extends CompanionAttributes {
  id: string
  bio: string
  profilePicture: ProfilePicture
  emotionsAnimations?: EmotionsAnimations
  chatClearedAt?: Date
}

export interface ProfilePicture {
  image: string
  thumbnail: string
}

export interface EmotionsAnimations {
  enabled: boolean
  tier: string
  urls: Record<string, string>
}

export interface AvailableCompanionsAttributesValues {
  gender: Record<string, string>
  hairColor: Record<string, string>
  hairLength: Record<string, string>
  eyeColor: Record<string, string>
  ancestralRegion: Record<string, string>
  skinTone: Record<string, string>
  facialHair: Record<string, string>
  attire: Record<string, string>
  universe: Record<string, string>
  personality: Record<string, string>
}

export interface CustomerAvailableCompanionsAttributes extends AvailableCompanionsAttributesValues {
  name: {
    maxLength: number
    defaultNames: Record<string, string[]>
  }
  age: {
    min: number
    max: number
  }
}

export interface AvailableCompanionsAttributes extends CustomerAvailableCompanionsAttributes {
  optionalAttributes: Record<string, Partial<AvailableCompanionsAttributesValues>>
}

export type ProductType = 'subscription' | 'one_time'
export type ProductStatus = 'available' | 'coming_soon'

export interface MarketplaceProduct {
  id: string
  name: string
  isNSFW: boolean
  type: ProductType
  status: ProductStatus
  shortDescription?: string
  description: string
  price: number
  thumbnailImage: string
  bannerImage: string
  includedInLifetimeSubscription: boolean
}

export interface ReferralInfo {
  nonPaidAccounts: number
  paidAccounts: number
  redeem: number
  previouslyRedeemed: number
}

export interface OwnModelParams {
  selected: string
  chatgptApiKey: string
  claudeApiKey: string
  geminiApiKey: string
  grokApiKey: string
}
