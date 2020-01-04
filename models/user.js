const db = require('../config/databaseconfig');

module.exports = class User {
    constructor(id, username, email, location, pasword) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.location = location;
        this.pasword = pasword;
    }

    save() {
        return db.execute(
            'INSERT INTO users (username, email, location, pasword) VALUES (?, ?, ?, ?)',
            [this.username, this.email, this.location, this.pasword]
        );
    }

    static deleteById(id) {

    }

    static fetchAll() {
        return db.execute('SELECT * FROM users');
    }

    static findByEmail(email) {
        return db.execute("SELECT * FROM users WHERE email = '" + email + "'")
    }
};
