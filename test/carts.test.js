const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Carts API', () => {
  let cartId;
  let productId;

  before(async () => {
    const createCartResponse = await chai.request(app).post('/carts');
    cartId = createCartResponse.body.cartId;

    productId = '659667c9d12f13252c93f726'; 
  });

  describe('POST /carts', () => {
    it('should create a new cart', (done) => {
      chai.request(app)
        .post('/carts')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').equal('New cart created');
          done();
        });
    });
  });

  describe('POST /carts/:cid/:pid', () => {
    it('should add a product to the cart', (done) => {
      chai.request(app)
        .post(`/carts/${cartId}/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').equal('Product added to cart');
          done();
        });
    });
  });

  describe('GET /carts/view/:cartId', () => {
    beforeEach(async () => {
      await chai.request(app)
        .post(`/carts/${cartId}/${productId}`);
    });

    it('should return cart products', (done) => {
      chai.request(app)
        .get(`/carts/view/${cartId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.cart).to.have.property('products');
          done();
        });
    });
  });
});



