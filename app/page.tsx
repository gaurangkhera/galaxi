import { Button } from '@/components/ui/button'
import React from 'react'
import { SignIn, SignInButton } from '@clerk/nextjs'

const page = () => {
  return (
    <SignInButton><Button>Hello</Button></SignInButton>
  )
}

export default page