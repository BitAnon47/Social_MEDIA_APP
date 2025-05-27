import bcrypt from 'bcrypt';
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username:{type: DataTypes.STRING,
      allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull:false,
      validate: { isEmail: true }
    },
    password: {type: DataTypes.STRING,
      allowNull:false,
    },
    profile_image_url: DataTypes.STRING,
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2, // assuming 2 = "user"
      references: {
        model: 'roles',
        key: 'id'
      }
    },

  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    scopes: {
  withPassword: { attributes: {} },
  withRole: {
    include: [{
      association: 'role',
      attributes: ['roleName'] // or 'name' depending on your Role model
    }]
  }
},
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
};
