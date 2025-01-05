'use client'

import { ThemeSwitcher } from "@/components/theme-switcher"
import HeaderAuth from "@/components/header-auth"
import { EnvVarWarning } from "@/components/env-var-warning"

interface HeaderWrapperProps {
  hasEnvVars: boolean
}

export default function HeaderWrapper({ hasEnvVars }: HeaderWrapperProps) {
  return (
    <div className="flex items-center gap-4">
      {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      <ThemeSwitcher />
    </div>
  )
} 