import { hashPassword, comparePassword } from './password.util'

describe('password.util', () => {
  it('hashed password should be compared', async () => {
    const hash = await hashPassword('local')
    const valid = await comparePassword('local', hash)
    const invalid = await comparePassword('invalid', hash)

    expect(valid).toBe(true)
    expect(invalid).toBe(false)
  })
})
