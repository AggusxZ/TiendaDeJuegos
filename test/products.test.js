const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Products API', () => {
  describe('GET /products', () => {
    it('should return status 200 and an array of products in HTML format', (done) => {
      chai.request(app)
        .get('/products?format=html')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.type).to.equal('text/html');
          done();
        });
    });

    it('should return status 200 and an array of products in JSON format', (done) => {
      chai.request(app)
        .get('/products?format=json')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
      });
    });
  
    describe('GET /products/:pid', () => {
      it('should return status 200 and the product details', (done) => {
        chai.request(app)
          .get('/products/659667c9d12f13252c93f725') 
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name');
            expect(res.body).to.have.property('price');
            expect(res.body).to.have.property('category');
            done();
          });
      });
    });
  
    describe('POST /products', () => {
      it('should add a new product and return status 201', (done) => {
        const newProduct = {
          name: 'New Product',
          price: 10,
          category: 'Sample Category'
        };
  
        chai.request(app)
          .post('/products')
          .send(newProduct)
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });
    });
  });