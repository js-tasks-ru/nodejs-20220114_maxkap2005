const Category = require('../models/Category');
const categoryMapper = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesRaw = await Category.find({});
  let categories = categoriesRaw.map(categoryMapper);
  ctx.body = {categories: categories};
};

module.exports.addCategory = async function addCategory(ctx, next) {

  const category = await Category.create({
    title: ctx.request.body.title
  });

  ctx.body = category;
};
