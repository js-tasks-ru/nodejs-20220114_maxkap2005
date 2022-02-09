const Product = require('../models/Product');
const mapperProduct = require('../mappers/product')

module.exports.productsByQuery = async function productsByQuery(ctx, next) {

    const text = ctx.query.query;

    const productsRaw = await Product
      .find({ $text : { $search : text } });

    ctx.body = {products: productsRaw.map(mapperProduct)};
};
