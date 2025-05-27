export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment_text: DataTypes.TEXT,
  }, {
    tableName: 'comments',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: false,
    defaultScope: {
      // Always return comments in latest order
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
      beforeCreate: (comment) => {
        if (comment.comment_text) {
          comment.comment_text = comment.comment_text.trim();
          if (comment.comment_text.length > 300) {
            throw new Error('Comment cannot exceed 300 characters.');
          }
        }
      },
      beforeUpdate: (comment) => {
        if (comment.comment_text) {
          comment.comment_text = comment.comment_text.trim();
          if (comment.comment_text.length > 300) {
            throw new Error('Comment cannot exceed 300 characters.');
          }
        }
      }
    }
  });

  return Comment;
};
