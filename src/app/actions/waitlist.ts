'use server'

import Airtable from 'airtable'

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!,
)

interface WaitlistData {
  email: string
}

export async function addToWaitlist(data: WaitlistData) {
  try {
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

    return { success: true, id: record[0].id }
  } catch (error) {
    console.error('Error creating Airtable record:', error)
    return { success: false, error: 'Failed to add to waitlist' }
  }
}
