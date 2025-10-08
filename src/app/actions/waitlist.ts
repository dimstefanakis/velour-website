'use server'

import Airtable from 'airtable'
import { sendLeadEvent, sendCompleteRegistrationEvent, generateEventId } from '@/lib/facebook-conversions'
import { headers } from 'next/headers'

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!,
)

interface WaitlistData {
  email: string
  eventId?: string
  completeRegistrationEventId?: string
  sourceUrl?: string
  fbp?: string
  fbc?: string
  externalId?: string
}

interface WaitlistResponse {
  success: boolean
  id?: string
  eventIds?: {
    lead: string
    completeRegistration: string
  }
  error?: string
}

export async function addToWaitlist(data: WaitlistData): Promise<WaitlistResponse> {
  try {
    // Get request headers for user info
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || undefined
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || undefined

    const leadEventId = data.eventId ?? generateEventId()
    const completeRegistrationEventId =
      data.completeRegistrationEventId ?? generateEventId()

    // Testing mode - skip actual Airtable call
    if (process.env.TESTING === 'true') {
      console.log('Testing mode - Waitlist data:', data)
      return {
        success: true,
        id: 'test-id',
        eventIds: {
          lead: leadEventId,
          completeRegistration: completeRegistrationEventId,
        },
      }
    }

    const record = await base('Waitlist').create([
      {
        fields: {
          Email: data.email
        },
      },
    ])

    // Send event to Facebook Conversions API
    const eventPromises: Promise<{ success: boolean; error?: string }>[] = [
      sendLeadEvent(
        data.email,
        leadEventId,
        ipAddress,
        userAgent,
        data.sourceUrl,
        data.fbp,
        data.fbc,
        data.externalId
      ),
      sendCompleteRegistrationEvent(
        data.email,
        completeRegistrationEventId,
        ipAddress,
        userAgent,
        data.sourceUrl,
        data.fbp,
        data.fbc,
        data.externalId
      ),
    ]

    await Promise.allSettled(eventPromises)

    return {
      success: true,
      id: record[0].id,
      eventIds: {
        lead: leadEventId,
        completeRegistration: completeRegistrationEventId,
      },
    }
  } catch (error) {
    console.error('Error creating Airtable record:', error)
    return { success: false, error: 'Failed to add to waitlist' }
  }
}
