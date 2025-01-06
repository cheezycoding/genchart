import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (!token_hash || !type) {
    console.error('Missing token_hash or type')
    return NextResponse.redirect(redirectTo)
  }

  const supabase = createClient()

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    console.error(error)
    return NextResponse.redirect(redirectTo)
  }

  return NextResponse.redirect(redirectTo)
}