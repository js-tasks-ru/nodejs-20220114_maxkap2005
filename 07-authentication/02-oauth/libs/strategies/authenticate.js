const User = require("../../models/User");

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  let user = await User.findOne({email});

  if (user) {
      return done(null, user);
  }

  try {
    user = await User.create({
      email, displayName,
    });
    done(null, user);
  }
  catch (e) {
    done(e);
  }

};
