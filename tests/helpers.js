const { expect } = require("chai");

const expectError = (res, status, errorCode) => {
  expect(res.status).to.equal(status);
  expect(res.body).to.have.all.keys("status", "errorCode", "message");
  expect(res.body.status).to.equal("error");
  expect(res.body.errorCode).to.equal(errorCode);
  expect(res.body.message).to.be.a("string").that.is.not.empty;
};

module.exports = { expectError };