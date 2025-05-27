export default (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: DataTypes.TEXT,
    image_url: DataTypes.STRING,
  }, {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: (post) => {
        if (post.content) {
          post.content = post.content.trim();
        }
      },
      beforeUpdate: (post) => {
        if (post.content) {
          post.content = post.content.trim();
        }
      }
    }
  });

  return Post;
};
