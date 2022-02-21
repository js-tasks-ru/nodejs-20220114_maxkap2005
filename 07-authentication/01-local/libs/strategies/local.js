const User = require("../../models/User");
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
        const user = await User.findOne({email});
        if (!user) {
            return done(null, false, 'Нет такого пользователя');
        }

        const isValidPassword = await user.checkPassword(password);

        if (!isValidPassword) {
            return done(null, false, 'Неверный пароль');
        }

        return done(null, user);
    },
);
