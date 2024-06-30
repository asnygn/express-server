import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import httpErrors from 'http-errors'
import { z } from 'zod'

import { zodValidator } from '@/utils/index.js'
import { guestUser, validate } from '@/middlewares/index.js'
import { userModel } from '@/database/schemas/user.js'

export const registerV1 = express.Router()

registerV1.post(
  '/v1/auth/register',
  guestUser,
  validate(validateRegister),
  async (req, res, next) => {
    try {
      res.send(await register(req, res))
    } catch (err) {
      next(err)
    }
  }
)

export function validateRegister({ body = {} }) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
    confirm_password: z.string(),
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

export async function register(req: Request, res: Response) {
  const { body } = req

  return {}
}
