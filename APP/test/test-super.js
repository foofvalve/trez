const request = require('supertest');
const express = require('express');
const app = express();
/*
app.get('http://localhost:8529/_db/cupboard/faux_app/results', function(req, res) {
  res.status(200);
});
*/
describe('GET /user', function() {
  it('responds with json', function(done) {
    request(app).get('https://beeceptor.com/')      
      .expect(200, done).end(function(err, res) {
        if (err) throw err;
      });
  });
});