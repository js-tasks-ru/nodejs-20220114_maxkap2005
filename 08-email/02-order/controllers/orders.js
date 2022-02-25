const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const User = require("../models/User");
const Product = require("../models/Product");
const mapOrderConfirmation = require("../mappers/orderConfirmation");
const mapOrder = require("../mappers/order");
const Category = require("../models/Category");

module.exports.checkout = async function checkout(ctx, next) {

    const order = new Order({
        user: ctx.user._id,
        product: ctx.request.body.product,
        phone: ctx.request.body.phone,
        address: ctx.request.body.address,
    });

    await order.save();

    const product = await Product.findById(ctx.request.body.product);

    console.log(order);
    console.log(product);

    await sendMail({
               template: 'order-confirmation',
               locals: {id: order._id, product: product},
               to: ctx.user.email,
               subject: 'Подтвердите заказ',
    });


    ctx.body = {order: order._id};

};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const orders = await Order.find({user:ctx.user._id});

    ctx.body = {orders: orders};

};
