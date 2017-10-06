const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', done => {
    chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.include('Palette Picker');
      done();
    });
  });

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
    .get('/foo')
    .end((error, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {
  before(done => {
    database.migrate.latest()
    .then(() => done())
    .catch(error => console.log(error))
  });

  beforeEach(done => {
    database.seed.run()
    .then(() => done())
    .catch(error => console.log(error))
  });

  describe('GET /api/v1/projects', () => {
    it('should get all of the projects', done => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('First_Project');
        done();
      });
    });

    it('should return a 404 status if the url is invalid', done => {
      chai.request(server)
      .get('/api/v1/foo')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should get all of the palettes', done => {
      chai.request(server)
      .get('/api/v1/palettes')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Pretty Colors');
        response.body[0].should.have.property('color1');
        response.body[0].color1.should.equal('#89A286');
        response.body[0].should.have.property('color2');
        response.body[0].color2.should.equal('#5B1328');
        response.body[0].should.have.property('color3');
        response.body[0].color3.should.equal('#5D4987');
        response.body[0].should.have.property('color4');
        response.body[0].color4.should.equal('#D016A0');
        response.body[0].should.have.property('color5');
        response.body[0].color5.should.equal('#3A127B');
        response.body[0].should.have.property('projectId')
        done();
      });
    });

    it('should return a 500 status if the url is invalid', done => {
      chai.request(server)
      .get('/api/v1/foo')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        id: 3,
        name: 'Third_Project'
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('array');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(3);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Third_Project');
        done();
      });
    });

    it('should not create a project with missing data', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        id: 4,
        colors: '#D016A0'
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(`Expected format: { name: <String> }. You're missing a name property.`)
        done();
      });
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should create a new palette', done => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        id: 5,
        name: 'Cool Colors',
        color1: '#4571F7',
        color2: '#79A726',
        color3: '#BE3A29',
        color4: '#C9AEB9',
        color5: '#788E70',
        projectId: 1
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('array');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(5);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Cool Colors');
        response.body[0].should.have.property('color1');
        response.body[0].color1.should.equal('#4571F7');
        response.body[0].should.have.property('color2');
        response.body[0].color2.should.equal('#79A726');
        response.body[0].should.have.property('color3');
        response.body[0].color3.should.equal('#BE3A29');
        response.body[0].should.have.property('color4');
        response.body[0].color4.should.equal('#C9AEB9');
        response.body[0].should.have.property('color5');
        response.body[0].color5.should.equal('#788E70');
        response.body[0].should.have.property('projectId');
        response.body[0].projectId.should.equal(1);
        done();
      });
    });

    it('should not create a palette with missing data', done => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        id: 5,
        name: 'Cool Colors',
        projectId: 1
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal("Expected format: { name: <String>, color1: <String>, 'color2': <String>, 'color3': <String>, 'color4': <String>, 'color5', 'projectId': <Integer> }. You're missing a color1 property.")
        done();
      });
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should delete a palette', done => {
      chai.request(server)
      .delete('/api/v1/palettes/1')
      .end((error, response) => {
        response.should.have.status(204);
        done();
      });
    });

    it('should return a 422 error if it could not find a palette', () => {
      chai.request(server)
      .delete('/api/v1/palettes/200')
      .end((error, response) => {
        response.should.have.status(422);
        done();
      })
    })
  });
});
