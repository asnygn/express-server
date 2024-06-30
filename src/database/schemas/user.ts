import { AccessibleRecordModel } from '@casl/mongoose'
import mongooseSlugPlugin from 'mongoose-slug-plugin'
import _ from 'underscore'

import mongoose from '@/plugins/mongoose.js'

export enum UserRoleEnum {
  MEMBER = 'Member',
  EDITOR = 'Editor',
  ADMIN = 'Admin',
  SUPER_ADMIN = 'Super Admin',
}

export enum UserStatusEnum {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  BLOCKED = 'Blocked',
}

export interface UserInterface {
  name: string
  email: string
  password: string
  roles: UserRoleEnum[]
  profileImage: object
  phone: string
  emailVerified: boolean
  phoneVerified: boolean
  status: UserStatusEnum
}

const userSchema = new mongoose.Schema<UserInterface>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: { type: String, select: false, required: true },
    roles: {
      type: [String],
      enum: Object.values(UserRoleEnum),
      default: [UserRoleEnum.MEMBER],
    },
    profileImage: { type: Object },
    phone: { type: String, trim: true },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(UserStatusEnum),
      default: UserStatusEnum.PENDING,
    },
  },
  { timestamps: true }
)

userSchema.plugin(mongooseSlugPlugin, {
  tmpl: '<%=name%>',
  historyField: 'slugHistory',
})

userSchema.pre('save', function (next) {
  this.roles = _.uniq(this.roles)
  next()
})

userSchema.pre('insertMany', function (next, docs) {
  if (Array.isArray(docs) && docs.length) {
    docs.map((element, index) => {
      docs[index].roles = _.uniq(element.roles)
    })
  }
  next()
})

userSchema.virtual('id').get(function () {
  return this._id
})

userSchema.set('toJSON', {
  virtuals: true,
})

export const userModel = mongoose.model<
  UserInterface,
  AccessibleRecordModel<UserInterface>
>('user', userSchema)
