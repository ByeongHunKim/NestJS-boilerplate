import { hash, genSalt, compare } from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt()
  return hash(password, salt)
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return compare(password, hash)
}
