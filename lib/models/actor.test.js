const pool = require('../utils/pool');
const fs = require('fs');

describe('fresh-tomatoes-db routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'))
  });

  it('adding dummy test to remove fail message', () => {
    expect('yes').toEqual('yes');
  });
});
