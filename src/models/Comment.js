class Comment {
    constructor(content, author, post) {
        this.content = content;
        this.author = author;
        this.post = post;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    updateContent(newContent) {
        this.content = newContent;
        this.updatedAt = new Date();
    }

    // Additional methods for comment-related operations can be added here
}

module.exports = Comment;