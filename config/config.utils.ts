import { env } from 'node:process'
import { EnvKey } from './index'

export function getEnv(envKey: EnvKey, defaultValue?: string): string {
  return typeof env[envKey] !== undefined
    ? (env[envKey] as string)
    : defaultValue
    ? defaultValue
    : ''
}

export function getEnvOrThrow(envKey: EnvKey): string {
  const value = getEnv(envKey)
  if (typeof value === undefined) {
    throw new Error(`Environment: ${envKey} should be defined`)
  }
  return value!
}
