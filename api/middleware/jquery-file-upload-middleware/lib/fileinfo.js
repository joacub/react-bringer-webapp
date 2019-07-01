/* eslint-disable func-names */
import gm from 'gm';
import fs from 'fs';

// const gm = _gm.subClass({ imageMagick: true });

module.exports = options => {
  const FileInfo = function (file) {
    this.file = file;
    this.name = file.name;
    this.originalName = file.name;
    this.size = file.size;
    this.type = file.type;
    this.deleteType = 'DELETE';
  };

  FileInfo.prototype.calculate = async function () {
    return new Promise((resolve, reject) => {
      gm(this.file.path).size((err, size) => {
        if (!err) {
          this.width = size.width;
          this.height = size.height;
          resolve(this);
        }

        reject(err);
      });
    });
  };

  FileInfo.prototype.validate = function () {
    if (options.minFileSize && options.minFileSize > this.size) {
      this.error = 'File is too small';
    } else if (options.maxFileSize && options.maxFileSize < this.size) {
      this.error = 'File is too big';
    } else if (!options.acceptFileTypes.test(this.name)) {
      this.error = 'Filetype not allowed';
    }
    return !this.error;
  };

  FileInfo.prototype.safeName = function () {
    // Prevent directory traversal and creating hidden system files:
    this.name = require('path')
      .basename(this.name)
      .replace(/^\.+/, '');
    // Prevent overwriting existing files:
    while (fs.existsSync(`${options.baseDir()}/${this.name}`)) {
      this.name = this.name.replace(
        /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/,
        (s, index, ext) => ` (${(parseInt(index, 10) || 0) + 1})${ext || ''}`
      );
    }
  };

  FileInfo.prototype.setUrl = function (type, baseUrl) {
    const key = type ? `${type}Url` : 'url';
    this[key] = `${baseUrl}/${encodeURIComponent(this.rename)}`;
  };

  return FileInfo;
};
