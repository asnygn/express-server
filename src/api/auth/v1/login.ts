import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import httpErrors from 'http-errors'
import { z } from 'zod'

import { zodValidator } from '@/utils/index.js'
import { guestUser, validate } from '@/middlewares/index.js'
import { userModel } from '@/database/schemas/user.js'
import {
  createAccessToken,
  createRefreshToken,
} from '@/services/auth.service.js'

export const loginV1 = express.Router()

loginV1.post(
  '/v1/auth/login',
  guestUser,
  validate(validateLogin),
  async (req, res, next) => {
    try {
      res.send(await login(req, res))
    } catch (err) {
      next(err)
    }
  }
)

export function validateLogin({ body = {} }) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const errors: { body?: {} } = {}

  const bodyErrors = zodValidator(bodySchema, body)

  if (bodyErrors) {
    errors.body = bodyErrors
  }

  if (Object.keys(errors).length) {
    throw httpErrors(422, { details: errors })
  }
}

export async function login(req: Request, res: Response) {
  const { body } = req

  const userRecord = await userModel
    .findOne({ email: body.email })
    .select('+password')
    .lean()

  if (!userRecord) {
    throw httpErrors(400, 'Wrong email or password.')
  }

  const validPassword = await bcrypt.compare(body.password, userRecord.password)

  if (!validPassword) {
    throw httpErrors(400, 'Wrong email or password.')
  }

  if (userRecord.status === 'Blocked') {
    throw httpErrors(400, 'Your account is blocked.')
  }

  if (!userRecord.emailVerified) {
    throw httpErrors(400, 'Please verify your email address.')
  }

  const accessToken = createAccessToken(userRecord._id)
  const refreshToken = createRefreshToken(userRecord._id)

  const { password, ...user } = userRecord

  return {
    user,
    tokenType: 'Bearer',
    accessToken,
    refreshToken,
  }
}
