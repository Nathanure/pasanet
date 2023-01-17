// Session config
const sessionMain = {
    // Used to assign the session ID cookie
    secret: '40f636909e7cf0058af4863a1db1b9fb83f4370558b5958a99d9d613beef8859a753fcc3d1a884435a6cdb9b29a545d2bba8468ac77a4e8f6324bb3772532889',
    // Don't save session if unmodified
    resave: false,
    // Don't create session until something stored
    saveUninitialized: false,
    // Time last for cookie
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}

module.exports = sessionMain