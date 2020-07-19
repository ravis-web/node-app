const fs = require('fs');

const delFile = (filepath) => { 
  fs.unlink(filepath, (err) => {
    if (err) throw (err);
  });
};

exports.delFile = delFile;