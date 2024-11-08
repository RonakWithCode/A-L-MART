import { config } from '@/lib/appwrite/client'
import React from 'react'

export default function checkout() {
  return (
    <div>{config.databaseId}</div>
  )
}
