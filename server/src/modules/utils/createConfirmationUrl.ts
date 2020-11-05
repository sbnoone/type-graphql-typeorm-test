// import { redis } from '../../index'
import { v4 } from 'uuid'

export const createConfirmationUrl = async (userId: number) => {
  const confirmationToken = v4()

  // await redis.set(confirmationToken, userId, 'exp', 60 * 60 * 24)

  return `http://localhost:3000/user/confirm/${confirmationToken}`
}
