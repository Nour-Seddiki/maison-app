import { createClient } from '@/lib/supabase/server'
import PortfolioClient from './PortfolioClient'
import { Property } from '@/types'

export const revalidate = 0 // Or handle revalidation as needed

export default async function PortfolioPage() {
  const supabase = await createClient()
  
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*, neighborhood:neighborhoods(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching properties:', error)
  }

  return <PortfolioClient initialProperties={(properties as unknown as Property[]) || []} />
}
