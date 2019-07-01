/* eslint-disable func-names */
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

module.exports = function (middleware, options) {
  options = _.extend(
    {
      targetDir() {
        return options.uploadDir();
      },
      targetUrl() {
        return options.uploadUrl();
      }
    },
    options
  );

  _.each(['targetDir', 'targetUrl'], key => {
    if (!_.isFunction(options[key])) {
      const originalValue = options[key];
      options[key] = function () {
        return originalValue;
      };
    }
  });

  const FileManager = function () {};

  FileManager.prototype.getFiles = function (callback) {
    const files = {};
    let counter = 1;
    const finish = function () {
      counter -= 1;
      if (!counter) {
        callback(files);
      }
    };

    fs.readdir(
      options.uploadDir(),
      _.bind(function (err, list) {
        _.each(
          list,
          name => {
            const stats = fs.statSync(`${options.uploadDir()}/${name}`);
            if (stats.isFile()) {
              files[name] = {
                path: `${options.uploadDir()}/${name}`
              };
              _.each(options.imageVersions, (value, version) => {
                counter += 1;
                fs.exists(`${options.uploadDir()}/${version}/${name}`, exists => {
                  if (exists) {
                    files[name][version] = `${options.uploadDir()}/${version}/${name}`;
                  }
                  finish();
                });
              });
            }
          },
          this
        );
        finish();
      }, this)
    );
  };

  const safeName = function (dir, filename, callback) {
    fs.exists(`${dir}/${filename}`, exists => {
      if (exists) {
        filename = filename.replace(
          /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/,
          (s, index, ext) => ` (${(parseInt(index, 10) || 0) + 1})${ext || ''}`
        );
        safeName(dir, filename, callback);
      } else {
        callback(filename);
      }
    });
  };

  const moveFile = function (source, target, callback) {
    fs.rename(source, target, err => {
      if (!err) {
        callback();
      } else {
        const is = fs.createReadStream(source);
        const os = fs.createWriteStream(target);
        is.on('end', _err => {
          if (!_err) {
            fs.unlink(source, callback);
          } else {
            callback(_err);
          }
        });
        is.pipe(os);
      }
    });
  };

  const move = function (source, targetDir, callback) {
    fs.exists(targetDir, exists => {
      if (!exists) {
        mkdirp(targetDir, err => {
          if (err) {
            callback(err);
          } else {
            move(source, targetDir, callback);
          }
        });
      } else {
        fs.stat(source, (err, stat) => {
          if (!err) {
            if (stat.isFile()) {
              safeName(targetDir, path.basename(source), safename => {
                moveFile(source, `${targetDir}/${safename}`, __err => {
                  callback(__err, safename);
                });
              });
            } else {
              callback(new Error(`${source} is not a file`));
            }
          } else {
            callback(err);
          }
        });
      }
    });
  };

  FileManager.prototype.move = function (filename, targetDir, callback) {
    let targetUrl;
    let relative = false;
    // for safety
    filename = path.basename(filename).replace(/^\.+/, '');

    if (!targetDir.match(/^\//)) {
      targetUrl = `${options.targetUrl()}/${targetDir}`;
      targetDir = `${options.targetDir()}/${targetDir}`;
      relative = true;
    }

    fs.stat(`${options.uploadDir()}/${filename}`, (err, stat) => {
      if (!err) {
        if (stat.isFile()) {
          move(`${options.uploadDir()}/${filename}`, targetDir, (_err, safename) => {
            if (_err) {
              callback(_err);
            } else {
              const urls = {
                filename: safename
              };

              let counter = 1;
              const finish = function (__err) {
                if (__err) {
                  counter = 1;
                }
                counter -= 1;
                if (!counter) {
                  callback(__err, __err ? null : urls);
                }
              };

              if (targetUrl) {
                urls.url = `${targetUrl}/${safename}`;
              }

              _.each(options.imageVersions, (value, version) => {
                counter += 1;
                fs.exists(`${options.uploadDir()}/${version}/${filename}`, exists => {
                  if (exists) {
                    move(
                      `${options.uploadDir()}/${version}/${filename}`,
                      `${targetDir}/${version}/`,
                      (__err, _safename) => {
                        if (!__err && relative) {
                          urls[`${version}Url`] = `${targetUrl}/${version}/${_safename}`;
                        }
                        finish(__err);
                      }
                    );
                  }
                });
              });
              finish();
            }
          });
        } else {
          callback(new Error('File not found'));
        }
      } else {
        callback(err);
      }
    });
  };

  return new FileManager();
};
