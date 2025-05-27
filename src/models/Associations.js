export const setupAssociations = (models) => {
  const { User, Post, Comment, Like,Role } = models;


  User.hasMany(Post, { foreignKey: 'user_id', as: 'posts', onDelete: 'CASCADE' });
  User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments', onDelete: 'CASCADE' });
  User.hasMany(Like, { foreignKey: 'user_id', as: 'likes', onDelete: 'CASCADE' });
  User.belongsTo(Role, {foreignKey: 'role_id',as: 'role'});

  Post.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
  Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments', onDelete: 'CASCADE' });
  Post.hasMany(Like, { foreignKey: 'post_id', as: 'likes', onDelete: 'CASCADE' });

  Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
  Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post', onDelete: 'CASCADE' });

  Like.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
  Like.belongsTo(Post, { foreignKey: 'post_id', as: 'post', onDelete: 'CASCADE' });

  Role.hasMany(User, {foreignKey: 'role_id',as: 'users'});
};
