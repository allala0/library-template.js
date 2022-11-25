const path = require('path');
const fs = require("fs");

const clean = directory => {
    directory = path.resolve(__dirname, directory)
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
    
      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });
};

clean('dist');
