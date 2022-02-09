const mongoose = require('mongoose');
const Product = require("../models/Product");
const productMapper = require('../mappers/product');

const searchProducts = async function (params){
  const productsRaw = await Product.find(params);
  return productsRaw.map(productMapper);
};

const searchProduct = async function (params){
  const productRaw = await Product.findOne(params);
  return (productRaw) ? productMapper(productRaw):false;
};



module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await searchProducts({subcategory: subcategory});

  ctx.body = {products: products};

};

module.exports.productList = async function productList(ctx, next) {
  const products = await searchProducts({});
  ctx.body = {products: products};
};

module.exports.productById = async function productById(ctx, next) {

  if (mongoose.Types.ObjectId.isValid(ctx.params.id)){
    const product = await searchProduct({ _id: ctx.params.id});

    if (!product) {
      ctx.status = 404;
      ctx.body = 'not found';
    } else {
      ctx.body = {product: product};
    }
  }
  else{
    ctx.status = 400;
    ctx.body = 'not valid';
  }


};

module.exports.addProduct = async function addProduct(ctx, next) {
  ctx.body = {};
};

