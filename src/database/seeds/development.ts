import bcrypt from 'bcrypt'

import { userModel } from '@/database/schemas/user.js'

const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@nomail.com',
    password: bcrypt.hashSync('superadmin', 10),
    roles: ['Super Admin'],
    emailVerified: true,
    status: 'Active',
  },
  {
    name: 'Admin',
    email: 'admin@nomail.com',
    password: bcrypt.hashSync('admin', 10),
    roles: ['Admin'],
    emailVerified: true,
    status: 'Active',
  },
  {
    name: 'Editor',
    email: 'editor@nomail.com',
    password: bcrypt.hashSync('editor', 10),
    roles: ['Editor'],
    emailVerified: true,
    status: 'Active',
  },
  {
    name: 'Member',
    email: 'member@nomail.com',
    password: bcrypt.hashSync('member', 10),
    roles: ['Member'],
    emailVerified: true,
    status: 'Active',
  },
]

async function importData() {
  await userModel.countDocuments().then(async (count) => {
    if (count === 0) {
      const userRecords = await userModel.insertMany(users)
      console.info(`+${userRecords.length} users added`)
    }
  })

  // @ts-ignore
  process.exit(0)
}

importData()
