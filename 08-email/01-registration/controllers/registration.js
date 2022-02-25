const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const validator = require("email-validator");
const Session = require("../models/Session");

module.exports.register = async (ctx, next) => {

    const verificationToken = uuid();

    const postRequest = ctx.request.body;
    const email = postRequest.email;
    const displayName = postRequest.displayName;
    const password = postRequest.password;


    let user = await User.findOne({email});


    if (!validator.validate(email)){
        ctx.status = 400;
        ctx.body = {errors: {email : 'Невалидный email' }};
        return;
    }

    if (user) {
        ctx.status = 400;
        ctx.body = {errors: {email : 'Такой email уже существует'}};
        return;
    }

    user = {
            email: email, displayName: displayName, verificationToken:verificationToken
    };
    const u = new User(user);
    await u.setPassword(password);
    await u.save();

    await sendMail({
               template: 'confirmation',
               locals: {token: verificationToken},
               to: email,
               subject: 'Подтвердите почту',
    });

    ctx.status = 200;
    ctx.body = {status: 'ok'};


};

module.exports.confirm = async (ctx, next) => {

    const verificationToken = ctx.request.body.verificationToken;

    let user = await User.findOne({verificationToken:verificationToken});

    if (!user){
        ctx.status = 400;
        ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};

    }
    else{
        user.verificationToken = undefined;
        await user.save();

        const token = uuid();
        await Session.create({token, user, lastVisit: new Date()});
        ctx.status = 200;
        ctx.body = {token};
    }


};
