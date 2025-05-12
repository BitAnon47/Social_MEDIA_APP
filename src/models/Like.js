class Like {
    constructor(user, post) {
        this.user = user; // The user who liked the post
        this.post = post; // The post that was liked
        this.createdAt = new Date(); // Timestamp of when the like was created
    }

    // Method to get like details
    getDetails() {
        return {
            user: this.user,
            post: this.post,
            createdAt: this.createdAt,
        };
    }
}

export default Like;