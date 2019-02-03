"use strict";
const { expect } = require("chai");
const request = require("@arangodb/request");


//const router1 = module.context.dependencies.faux_app.routes;
//module.context.use(router1);
const { baseUrl } = module.context;

describe("this service", () => {
  it("should say 'Hello World!' at the index route", () => {
    console.log(module.context);
    const response = request.get(baseUrl);

    expect(module.context).to.equal(200);
    expect(response.body).to.equal("Hello World!");
  });
  it("should say meh", () => {
    console.log(module.context);
    const response = request.get(`${baseUrl}/results`);

    expect(response.status).to.equal(200);
    expect(response.body).to.equal("Hello World!");
  });
  it("should greet us with name", () => {
    const response = request.get(`${baseUrl}/Steve`);
    expect(response.status).to.equal(200);
    expect(response.body).to.equal("Hello Steve!");
  });
});

/*global describe, it 
'use strict';
const expect = require('chai').expect;

describe('science', function () {
  it('works', function () {
    expect(true).not.to.equal(false);
  });
});

*/
