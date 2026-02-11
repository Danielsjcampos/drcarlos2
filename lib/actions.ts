'use client'

import { useState } from 'react'

export async function createLead(formData: any) {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    return await response.json()
  } catch (error) {
    console.error('Lead submission failed:', error)
    return { success: false }
  }
}
