import express, { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { z } from 'zod'

import { zodValidator } from '@/utils/index.js'
import { authUser, validate } from '@/middlewares/index.js'
import {
  userModel,
  UserRoleEnum,
  UserStatusEnum,
} from '@/database/schemas/user.js'

export const createUserV1 = express.Router()

createUserV1.post(
  '/v1/users',
  authUser,
  validate(validateCreateUser),
  async (req, res, next) => {
    try {
      res.send(await createUser(req, res))
    } catch (err) {
      next(err)
    }
  }
)

export function validateCreateUser({ body = {} }) {
  const userRolesList = Object.values(UserRoleEnum)
  const userStatusList = Object.values(UserStatusEnum)

  const bodySchema = z.object({
    name: z.string(),
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

export async function createUser(req: Request, res: Response) {
  const { body } = req
  const userObject = await userModel.create(body)
  const { password, ...userRecord } = userObject.toJSON()
  return userRecord
}
