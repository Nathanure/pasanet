const whitelist = ['http://127.0.0.1:5500', 'http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) return callback(null, true)
        callback(new Error ('Page closed by CORS'))
    },
    optionsSuccessStatus: 200
    // origin: '*',
    // optionsSuccessStatus: 200
}

module.exports = corsOptions