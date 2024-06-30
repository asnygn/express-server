import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import httpErrors from 'http-errors'
import mongoose from 'mongoose'

import { authUser, validate } from '@/middlewares/index.js'
import { userModel } from '@/database/schemas/user.js'
import { defineAbilityForUser } from '@/plugins/casl.js'

export const getUsersV1 = express.Router()

getUsersV1.get('/v1/users', authUser, async (req, res, next) => {
  try {
    res.send(await getUsers(req, res))
  } catch (err) {
    next(err)
  }
})

export async function getUsers(req: Request, res: Response) {
  const { query } = req

  const options: RequestQuery = {
    skip: query.skip ? parseInt(query.skip as string) : 0,
    limit: query.limit ? parseInt(query.limit as string) : 20,
    sort: { createdAt: -1 },
  }

  const result: { data: []; total: number } = { data: [], total: 0 }

  const ability = defineAbilityForUser()

  result.data = await userModel
    .accessibleBy(ability)
    .find({}, {}, options)
    .lean()
  result.total = await userModel.accessibleBy(ability).countDocuments({})

  return result
}
