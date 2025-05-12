class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Method to save the user to the database
    save() {
        // Logic to save user to the database
    }

    // Method to find a user by email
    static findByEmail(email) {
        // Logic to find user by email
    }

    // Method to validate password
    validatePassword(password) {
        // Logic to validate the password
    }
}

module.exports = User;