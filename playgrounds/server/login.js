const data = require('./index');

module.exports = (req, res, next) => {
    let users = data().users;

    if (req.method == 'POST' && req.path == '/login') {
        var user = users.filter(u => u.email === req.body.username && u.password === req.body.password);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ message: 'wrong password' })
        }
    } else {
        next()
    }
}