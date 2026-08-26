import { fetchGlobal } from '../../payload'

export interface PrivacyPolicyData {
  lastUpdated?: string
  content?: unknown
  banner?: {
    text?: unknown
    acceptLabel?: string
    rejectLabel?: string
  }
}

export async function fetchPrivacyPolicy(): Promise<PrivacyPolicyData | null> {
  return fetchGlobal<PrivacyPolicyData>('privacy-policy', 1)
}
