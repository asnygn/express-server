import { AbilityBuilder, createMongoAbility } from '@casl/ability'

export const Permissions = {
  MANAGE: 'manage',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
}

export function defineAbilityForUser() {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

  can(Permissions.READ, 'user')

  return build()
}
