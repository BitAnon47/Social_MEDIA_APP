export default (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {}, {
    tableName: 'likes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    defaultScope: {
      // Always return likes ordered by newest
      order: [['created_at', 'DESC']]
    },
    scopes: {
      byUser(userId) {
        return {
          where: { user_id: userId }
        };
      },
      byPost(postId) {
        return {
          where: { post_id: postId }
        };
      }
    },
    hooks: {
      beforeCreate: async (like, options) => {
        const exists = await sequelize.models.Like.findOne({
          where: {
            user_id: like.user_id,
            post_id: like.post_id
          }
        });
        if (exists) {
          throw new Error('You have already liked this post.');
        }
      }
    }
  });

  return Like;
};
