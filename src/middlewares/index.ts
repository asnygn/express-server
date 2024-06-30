import { Request, Response, NextFunction } from 'express'
import jsonWebToken from 'jsonwebtoken'
import httpErrors from 'http-errors'

import { userModel } from '@/database/schemas/user.js'

/**
 * Global error handler.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { status = 500, name: error, message, details } = err
  res.status(status).send({ status, error, message, details })

  next()
}

/**
 * Only auth user can access route.
 */
export function authUser(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers['authorization']
  const token = authorization && authorization.split(' ')[1]

  if (!token) {
    throw httpErrors(401)
  }

  try {
    const jwt = jsonWebToken.verify(token, process.env.JWT_ACCESS_KEY as string)

    // if (jwt.userId) {
    //   req.authUser = userModel.find({ _id: jwt.userId }).lean()
    // }
  } catch (err: any) {
    throw httpErrors(401, err.message)
  }

  next()
}

/**
 * Only guest user can access route.
 */
export function guestUser(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers['authorization']

  if (authorization) {
    throw httpErrors(403)
  }

  next()
}

/**
 * Input validation.
 */
export function validate(validation: (req: Request) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    next(validation(req))
  }
}
