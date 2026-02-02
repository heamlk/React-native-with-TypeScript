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
  start_date: number
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  options?: Record<string, SubscriptionOption>
}

export interface SubscriptionOption {
  cancel_at_period_end: boolean
  active_until: number
  platform: 'web' | 'android' | 'ios' | null
}

export interface Purchase {
  createdAt: Date
}

export interface CustomerProfile {
  email: string
  is_subscribed: boolean
  username?: string
  first_name?: string
  last_name?: string
  date_of_birth?: string
  address?: Address
  interests?: string[]
  avatar?: string
  lifetime_subscription: boolean
  subscription?: Subscription
  purchases?: Record<string, Purchase>
  is_age_verified: boolean
  nsfw_disabled_since?: Date
  personal_referral_code?: string
  is_stripe_account_setup: boolean
  animation_generation_quota: number
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
  hair_color: string
  hair_length: string
  eye_color: string
  skin_tone: string
  facial_hair?: string
  attire: string
  universe: string
  personality: string
  ancestral_region: string
}

export interface ImageMedia {
  id: string
  created_at: Date
  image: string
  thumbnail: string
  is_nsfw: boolean
  animation_url?: string
  animation_generation_status?: string
}

export interface CompanionMedia {
  images: ImageMedia[]
}

export interface CompanionInfos extends CompanionAttributes {
  id: string
  bio: string
  profile_picture: ProfilePicture
  emotions_animations?: EmotionsAnimations
  chat_cleared_at?: Date
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
  is_nsfw: boolean
  type: ProductType
  status: ProductStatus
  short_description?: string
  description: string
  price: number
  thumbnail_image: string
  banner_image: string
  included_in_lifetime_subscription: boolean
}

export interface ReferralInfo {
  non_paid_accounts: number
  paid_accounts: number
  redeem: number
  previously_redeemed: number
}

export interface OwnModelParams {
  selected: 'bffl' | 'chatgpt' | 'claude' | 'gemini' | 'grok'
  chatgpt_api_key: string
  claude_api_key: string
  gemini_api_key: string
  grok_api_key: string
}

export default function Blank() {}
