const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById, addProduct} = require('./controllers/products');
const {categoryList, addCategory} = require('./controllers/categories');

const app = new Koa();

app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {

    console.log(err);

    if (err.name === 'ValidationError') {

      ctx.status = 400;

      ctx.body = Object.keys(err.errors).reduce((acc, field) => {
        return {
          ...acc,
          [field]: err.errors[field].message,
        };
      }, {});
    }
    else {


      if (err.status) {
        ctx.status = err.status;
        ctx.body = {error: err.message};
      } else {
        console.error(err);
        ctx.status = 500;
        ctx.body = {error: 'Internal server error'};
      }
    }
  }
});



const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.post('/add-category', addCategory);
router.post('/add-product', addProduct);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);

app.use(router.routes());

module.exports = app;
