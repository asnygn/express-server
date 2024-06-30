import express, { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { z } from 'zod'

import { zodValidator } from '@/utils/index.js'
import { authUser, validate } from '@/middlewares/index.js'
import { userModel } from '@/database/schemas/user.js'

export const deleteUserV1 = express.Router()

deleteUserV1.delete(
  '/v1/users',
  authUser,
  validate(validateDeleteUser),
  async (req, res, next) => {
    try {
      res.send(await deleteUser(req, res))
    } catch (err) {
      next(err)
    }
  }
)

export function validateDeleteUser({ body = {} }) {
  const bodySchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid input'),
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

export async function deleteUser(req: Request, res: Response) {
  return await userModel.deleteMany({ _id: { $in: req.body.id } })
}
