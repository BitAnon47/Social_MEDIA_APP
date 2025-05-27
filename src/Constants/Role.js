const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  COMMON: 'common',
  MODERATOR: 'moderator'
};

const ROLESGROUP = {
  AdminRole: [ROLES.ADMIN],
  AdminUserRole: [ROLES.ADMIN, ROLES.USER],
  CommonRole: [ROLES.ADMIN, ROLES.USER, ROLES.MODERATOR, ROLES.COMMON]
};

export default { ROLES, ROLESGROUP };
