class Post {
    constructor(title, content, author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    updateContent(newContent) {
        this.content = newContent;
        this.updatedAt = new Date();
    }

    static validatePostData(data) {
        if (!data.title || !data.content || !data.author) {
            throw new Error("Title, content, and author are required.");
        }
    }
}

module.exports = Post;