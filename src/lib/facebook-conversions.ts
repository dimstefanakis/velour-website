import crypto from 'crypto'

const FACEBOOK_API_VERSION = 'v18.0'
const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com'

interface FacebookEventData {
  eventName: string
  eventTime: number
  eventId: string
  userData: {
    email?: string
    clientIpAddress?: string
    clientUserAgent?: string
    fbc?: string
    fbp?: string
    externalId?: string
  }
  customData?: Record<string, string | number | boolean>
  actionSource: 'website'
  sourceUrl?: string
}

/**
 * Hash email for Facebook Conversions API
 * Facebook requires SHA256 hashing of PII data
 */
export function hashEmail(email: string): string {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex')
}

/**
 * Generate a unique event ID for deduplication
 */
export function generateEventId(): string {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * Send event to Facebook Conversions API
 */
export async function sendFacebookEvent(
  eventData: FacebookEventData
): Promise<{ success: boolean; error?: string }> {
  try {
    const pixelId = process.env.FACEBOOK_PIXEL_ID
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
    
    if (!pixelId || !accessToken) {
      console.error('Missing Facebook configuration')
      return { success: false, error: 'Missing Facebook configuration' }
    }

    // Hash email if provided
    interface UserData {
      client_ip_address?: string
      client_user_agent?: string
      em?: string
      fbc?: string
      fbp?: string
      external_id?: string
    }

    const userData: UserData = {
      client_ip_address: eventData.userData.clientIpAddress,
      client_user_agent: eventData.userData.clientUserAgent,
    }

    if (eventData.userData.email) {
      userData.em = hashEmail(eventData.userData.email)
    }

    if (eventData.userData.fbc) {
      userData.fbc = eventData.userData.fbc
    }

    if (eventData.userData.fbp) {
      userData.fbp = eventData.userData.fbp
    }

    if (eventData.userData.externalId) {
      userData.external_id = hashEmail(eventData.userData.externalId)
    }

    interface EventPayload {
      event_name: string
      event_time: number
      event_id: string
      action_source: string
      user_data: UserData
      event_source_url?: string
      custom_data?: Record<string, string | number | boolean>
    }

    const eventPayload: EventPayload = {
      event_name: eventData.eventName,
      event_time: eventData.eventTime,
      event_id: eventData.eventId,
      action_source: eventData.actionSource,
      user_data: userData,
    }

    // Add event_source_url if provided
    if (eventData.sourceUrl) {
      eventPayload.event_source_url = eventData.sourceUrl
    }

    // Add custom_data if provided
    if (eventData.customData) {
      eventPayload.custom_data = eventData.customData
    }

    interface PayloadData {
      data: EventPayload[]
      test_event_code?: string
    }

    const payload: PayloadData = {
      data: [eventPayload],
    }

    // Add test event code if in development
    const testEventCode = process.env.FACEBOOK_TEST_EVENT_CODE
    if (testEventCode) {
      payload.test_event_code = testEventCode
    }

    const url = `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${pixelId}/events?access_token=${accessToken}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Facebook Conversions API error:', result)
      return { 
        success: false, 
        error: result.error?.message || 'Failed to send event' 
      }
    }

    console.log('Facebook event sent successfully:', {
      eventName: eventData.eventName,
      eventId: eventData.eventId,
      eventsReceived: result.events_received,
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending Facebook event:', error)
    return { 
      success: false, 
      error: 'Failed to send event to Facebook' 
    }
  }
}

/**
 * Send Lead event to Facebook Conversions API
 */
export async function sendLeadEvent(
  email: string,
  eventId: string,
  ipAddress?: string,
  userAgent?: string,
  sourceUrl?: string,
  fbp?: string,
  fbc?: string,
  externalId?: string
): Promise<{ success: boolean; error?: string }> {
  return sendFacebookEvent({
    eventName: 'Lead',
    eventTime: Math.floor(Date.now() / 1000),
    eventId,
    actionSource: 'website',
    sourceUrl,
    userData: {
      email,
      clientIpAddress: ipAddress,
      clientUserAgent: userAgent,
      fbp,
      fbc,
      externalId,
    },
    customData: {
      content_name: 'Email Waitlist',
      currency: 'USD',
      value: 0.0,
    },
  })
}

/**
 * Send CompleteRegistration event to Facebook Conversions API
 */
export async function sendCompleteRegistrationEvent(
  email: string,
  eventId: string,
  ipAddress?: string,
  userAgent?: string,
  sourceUrl?: string,
  fbp?: string,
  fbc?: string,
  externalId?: string
): Promise<{ success: boolean; error?: string }> {
  return sendFacebookEvent({
    eventName: 'CompleteRegistration',
    eventTime: Math.floor(Date.now() / 1000),
    eventId,
    actionSource: 'website',
    sourceUrl,
    userData: {
      email,
      clientIpAddress: ipAddress,
      clientUserAgent: userAgent,
      fbp,
      fbc,
      externalId,
    },
    customData: {
      content_name: 'Email Waitlist Completed',
      currency: 'USD',
      value: 0.0,
    },
  })
}

/**
 * Send PageView event to Facebook Conversions API
 */
export async function sendPageViewEvent(
  eventId: string,
  ipAddress?: string,
  userAgent?: string,
  sourceUrl?: string
): Promise<{ success: boolean; error?: string }> {
  return sendFacebookEvent({
    eventName: 'PageView',
    eventTime: Math.floor(Date.now() / 1000),
    eventId,
    actionSource: 'website',
    sourceUrl,
    userData: {
      clientIpAddress: ipAddress,
      clientUserAgent: userAgent,
    },
  })
}
