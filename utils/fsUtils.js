const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {Promise<void>} A promise that resolves when the data is written to the file.
 */
const writeToFile = (destination, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => {
      if (err) {
        reject(err);
      } else {
        console.info(`\nData written to ${destination}`);
        resolve();
      }
    });
  });
};

/**
 *  Function to read data from a given file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {Promise<void>} A promise that resolves when the data is read, appended, and written to the file.
 */
const readAndAppend = (content, file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData)
          .then(resolve)
          .catch(reject);
      }
    });
  });
};

module.exports = { readFromFile, writeToFile, readAndAppend };
