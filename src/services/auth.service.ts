import jsonWebToken from 'jsonwebtoken'
import { Types } from 'mongoose'

const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY

export function createAccessToken(userId: Types.ObjectId) {
  return jsonWebToken.sign({ userId }, JWT_ACCESS_KEY, {
    expiresIn: JWT_ACCESS_EXPIRY,
  })
}

export function createRefreshToken(userId: Types.ObjectId) {
  return jsonWebToken.sign({ userId }, JWT_REFRESH_KEY, {
    expiresIn: JWT_REFRESH_EXPIRY,
  })
}
