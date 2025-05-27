// models/role.js
export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleName: DataTypes.STRING
  }, {
    tableName: 'roles',
    timestamps: false
  });

  return Role;
};
