'use strict';

const migrator = require('./data_import.js');
migrator.run((err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  process.exit(0);
})
