const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Carts API', () => {
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

  describe('GET /carts', () => {
    it('should return cart products', (done) => {
      chai.request(app)
        .get('/carts')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /carts/:pid', () => {
    it('should add a product to the cart', (done) => {
      const productId = '659667c9d12f13252c93f725';
      const cartId = '65d765a542777c4a9131d0a8';
      chai.request(app)
        .post(`/carts/${productId}`)
        .send({ cartId: cartId })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').equal('Product added to cart');
          done();
        });
    });
  });

  describe('POST /carts/:cid/purchase', () => {
    it('should purchase the cart and return a success message', (done) => {
      const cartId = '65d765a542777c4a9131d0a8';
      chai.request(app)
        .post(`/carts/${cartId}/purchase`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').equal('Purchase completed successfully');
          done();
        });
    });
  });
});
