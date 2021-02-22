
module.exports = (req, res, next) => {
    // --- /account/login
    if (req.method == 'POST' && req.path == '/account/login') {
        const users = require('./index')().users;
        const maxAge = 36000000;

        let user = users.filter(u => u.email === req.body.email && u.password === req.body.password)[0];
        if (user) {
            res.status(200).cookie('auth', user.id, { maxAge: maxAge, httpOnly: true}).json(user);
        } else {
            res.status(400).json(req.body)
        }
    } 
    // --- /account/logout
    else if ((req.method == 'POST' || req.method == 'GET') && req.path == '/account/logout') {
        const maxAge = 0;
        let expire = Date.now() - 36000;
        res.status(200).cookie('auth', undefined, { maxAge: maxAge, expire: expire }).json({});
    } 
    // --- /account
    else if ((req.method == 'POST' || req.method == 'GET') && req.path == '/account') {
        let users = require('./index')().users;
        let cookies = req.headers["cookie"];
        let user = undefined;
        if (cookies) {
            cookies.split(';').forEach(cookie => {
                let kvp = cookie.split('=');
                let key = kvp[0].trim();
                let value = kvp[1].trim();
                if (key === 'auth') {
                    user = users.filter(u => u.id === value)[0];
                }
            });
    
            if (user) {
                res.status(200).json(user);
                return;
            } 
        }

        res.status(401).json({});
    } 
    // --- /words/random
    else if (req.method == 'GET' && req.path == '/words/random') {
        let words = require('./index')().words;
        let word = words[Math.floor(Math.random() * words.length)];

        res.status(200).json(word);
    }
    else {
        next()
    }
}