'use server'

import Airtable from 'airtable'
import { sendLeadEvent } from '@/lib/facebook-conversions'
import { headers } from 'next/headers'

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!,
)

interface WaitlistData {
  email: string
  eventId?: string
  sourceUrl?: string
}

export async function addToWaitlist(data: WaitlistData) {
  try {
    // Get request headers for user info
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || undefined
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || undefined
    
    // Testing mode - skip actual Airtable call
    if (process.env.TESTING === 'true') {
      console.log('Testing mode - Waitlist data:', data)
      return { success: true, id: 'test-id' }
    }

    const record = await base('Waitlist').create([
      {
        fields: {
          Email: data.email
        },
      },
    ])

    // Send event to Facebook Conversions API
    if (data.eventId) {
      await sendLeadEvent(
        data.email,
        data.eventId,
        ipAddress,
        userAgent,
        data.sourceUrl
      )
    }

    return { success: true, id: record[0].id }
  } catch (error) {
    console.error('Error creating Airtable record:', error)
    return { success: false, error: 'Failed to add to waitlist' }
  }
}
