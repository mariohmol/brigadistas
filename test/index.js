const { DATABASE_URL,ENV } = require('./config');
global.ENV=ENV;
const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();

describe('Init', function() {

  before(function (done) {
      mongoose.connect(DATABASE_URL, function(err, dbc){
          mongoose.connection.db.dropDatabase(function(){
              done();
          });
      });
  });

  it('exists', done => {
    done();
  });
});
