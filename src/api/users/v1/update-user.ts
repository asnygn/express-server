import express, { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { z } from 'zod'

import { zodValidator } from '@/utils/index.js'
import { authUser, validate } from '@/middlewares/index.js'
import { userModel } from '@/database/schemas/user.js'

export const updateUserV1 = express.Router()

updateUserV1.patch(
  '/v1/users',
  authUser,
  validate(validateUpdateUser),
  async (req, res, next) => {
    try {
      res.send(await updateUser(req, res))
    } catch (err) {
      next(err)
    }
  }
)

export function validateUpdateUser({ body = {} }) {
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

export async function updateUser(req: Request, res: Response) {
  const { body } = req

  if (Array.isArray(body)) {
    if (body.length) {
      return await Promise.all(
        body.map((item) => {
          return userModel.updateOne({ _id: item.id }, item)
        })
      )
    } else {
      return { success: true }
    }
  }

  return await userModel.updateOne({ _id: body.id }, body)
}
