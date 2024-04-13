/* const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Session API', () => {
  describe('GET /api/current', () => {
    it('should return the current user information when authenticated', (done) => {
      chai.request(app)
        .get('/api/current')
        .set('Cookie', ['connect.sid=s%3Ah8NQFBK_8UkbTt_mEfCXaN31h7MzmQNM.6Jp%2FMmFmm6qljwP8yU6VuTAIjqda%2Fk9Mg42qTFq8Nwo'])
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('email');
          expect(res.body.user).to.have.property('role');
          done();
        });
    });

    it('should return an error when not authenticated', (done) => {
      chai.request(app)
        .get('/api/current')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
}); */