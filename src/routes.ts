import express from 'express'

// Auth
import { loginV1 } from './api/auth/v1/login.js'
import { registerV1 } from './api/auth/v1/register.js'

// Users
import { getUsersV1 } from './api/users/v1/get-users.js'
import { createUserV1 } from './api/users/v1/create-user.js'
import { updateUserV1 } from './api/users/v1/update-user.js'
import { deleteUserV1 } from './api/users/v1/delete-user.js'

export const router = express.Router()

router.use('/', loginV1)
router.use('/', registerV1)

router.use('/', getUsersV1)
router.use('/', createUserV1)
router.use('/', updateUserV1)
router.use('/', deleteUserV1)
