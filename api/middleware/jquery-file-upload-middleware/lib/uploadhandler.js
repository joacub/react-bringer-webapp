/* eslint-disable func-names */
import { Images } from 'database/Models';
import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import mkdirp from 'mkdirp';
import _ from 'lodash';
import async from 'async';
import crypto from 'crypto';
// import downloadImage from 'utils/downloadImage';

module.exports = function (options) {
  const FileInfo = require('./fileinfo')(
    _.extend(
      {
        baseDir: options.uploadDir
      },
      _.pick(options, 'minFileSize', 'maxFileSize', 'acceptFileTypes')
    )
  );

  const UploadHandler = function (req, res, callback) {
    EventEmitter.call(this);
    this.req = req;
    this.res = res;
    this.callback = callback;
  };
  require('util').inherits(UploadHandler, EventEmitter);

  UploadHandler.prototype.noCache = function () {
    this.res.set({
      Pragma: 'no-cache',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    });
    if ((this.req.get('Accept') || '').indexOf('application/json') !== -1) {
      this.res.set({
        'Content-Type': 'application/json',
        'Content-Disposition': 'inline; filename="files.json"'
      });
    } else {
      this.res.set({ 'Content-Type': 'text/plain' });
    }
  };

  UploadHandler.prototype.get = function () {
    this.noCache();
    const files = [];
    fs.readdir(
      options.uploadDir(),
      _.bind(function (err, list) {
        async.each(
          list,
          _.bind(function (name, cb) {
            fs.stat(
              `${options.uploadDir()}/${name}`,
              _.bind(function (_err, stats) {
                if (!_err && stats.isFile()) {
                  const fileInfo = new FileInfo({
                    name,
                    size: stats.size
                  });
                  this.initUrls(fileInfo, __err => {
                    files.push(fileInfo);
                    cb(__err);
                  });
                } else cb(_err);
              }, this)
            );
          }, this),
          _.bind(function (__err) {
            if (__err) console.log(__err);
            this.callback({ files });
          }, this)
        );
      }, this)
    );
  };

  UploadHandler.prototype.post = function () {
    const self = this;
    const form = new formidable.IncomingForm();
    const tmpFiles = [];
    const files = [];
    const map = {};
    let counter = 1;
    let redirect;

    const finish = _.bind(function () {
      if (self.req && self.req.fields && self.req.fields.url) {
        downloadImage(self.req.fields.url).then(result => {
          this.emit('end', result);
          this.callback({ files: [result] }, redirect);
        }).catch(e => {
          console.log(e);
        });
        return;
      }

      counter -= 1;
      if (!counter) {
        async.each(
          files,
          _.bind(function (fileInfo, cb) {
            this.initUrls(
              fileInfo,
              _.bind(function (err) {
                this.emit('end', fileInfo);
                cb(err);
              }, this)
            );
          }, this),
          _.bind(function (err) {
            if (err) console.log(err);
            this.callback({ files }, redirect);
          }, this)
        );
      }
    }, this);

    this.noCache();

    form.uploadDir = options.tmpDir;
    form
      .on('fileBegin', async (name, file) => {
        tmpFiles.push(file.path);
        const fileInfo = new FileInfo(file);
        fileInfo.safeName();
        map[path.basename(file.path)] = fileInfo;
        files.push(fileInfo);
        self.emit('begin', fileInfo);
      })
      .on('field', (name, value) => {
        if (name === 'redirect') {
          redirect = value;
        }
        if (!self.req.fields) {
          self.req.fields = {};
        }
        self.req.fields[name] = value;
      })
      .on('file', (name, file) => {
        counter += 1;
        const fileInfo = map[path.basename(file.path)];

        fs.exists(file.path, async exists => {
          if (exists) {
            fileInfo.size = file.size;
            if (!fileInfo.validate()) {
              fs.unlink(file.path, () => {
                finish();
              });
              return;
            }

            const result = await fileInfo.calculate().catch(() => ({
              error: true
            }));

            if (result.error) {
              fs.unlink(file.path, () => {
                finish();
              });
              return;
            }

            fs.readFile(file.path, (err, data) => {
              if (err) throw err; // Fail if the file can't be read.
              const hash = crypto
                .createHash('md5')
                .update(data)
                .digest('base64')
                .toString();

              const generateImageDatabase = async callback => {
                // eslint-disable-next-line
                const _shortid = `1*${hash
                  .replace(/\+/g, '-')
                  .replace(/\//g, '_')
                  .substring(0, hash.length - 2)}`;
                // eslint-disable-next-line
                const exits = await Images.findOne({ where: { md5: _shortid } });
                if (!exits) {
                  const {
                    file: fileDescarted, deleteType, width, height, size, ...otherData
                  } = fileInfo;
                  Images.create({
                    md5: _shortid,
                    width,
                    height,
                    size,
                    // UserId: this.req.user.id,
                    data: otherData,
                    format: fileInfo.type
                  }).then(_data => {
                    callback(_data);
                  });
                  return;
                }
                const imageId = exits.dataValues.md5;
                const { width, height } = exits.dataValues;
                const fileTypeParts = fileInfo.type.split('/');
                const imageNameSaved = `${imageId}.${fileTypeParts[fileTypeParts.length - 1]}`;
                fileInfo.rename = imageNameSaved;
                fileInfo.id = imageId;
                fileInfo.width = width;
                fileInfo.height = height;
                finish();
              };

              generateImageDatabase(image => {
                const imageId = image.dataValues.md5;
                const fileTypeParts = fileInfo.type.split('/');
                const imageNameSaved = `${imageId}.${fileTypeParts[fileTypeParts.length - 1]}`;
                fileInfo.rename = imageNameSaved;
                fileInfo.id = imageId;
                // const generatePreviews = function () {
                //   if (options.imageTypes.test(fileInfo.name)) {
                //     _.each(options.imageVersions, (value, version) => {
                //       counter += 1;
                //       // creating directory recursive
                //       mkdirp(`${options.uploadDir()}/${version}/`, _err => {
                //         if (_err) console.log(_err);
                //         const opts = options.imageVersions[version];
                //         const imageInstance = gm(`${options.uploadDir()}/full/${imageNameSaved}`);
                //         if (opts.quality) {
                //           imageInstance.quality(opts.quality);
                //         }
                //         if (opts.type === 'crop') {
                //           imageInstance.gravity('Center');
                //           imageInstance.resize(opts.width, opts.height, '^');
                //           imageInstance.crop(opts.width, opts.height);
                //         } else {
                //           imageInstance.resize(opts.width, opts.height, opts.options || '>');
                //         }

                //         imageInstance
                //           .noProfile()
                //           .write(`${options.uploadDir()}/${version}/${imageNameSaved}`, __err => {
                //             if (__err) console.log(__err);
                //             finish();
                //           });
                //       });
                //     });
                //   }
                // };

                mkdirp(`${options.uploadDir()}/full/`, _err => {
                  if (_err) console.log(_err);
                  fs.rename(file.path, `${options.uploadDir()}/full/${imageNameSaved}`, __err => {
                    if (!__err) {
                      // generatePreviews();
                      finish();
                    } else {
                      const is = fs.createReadStream(file.path);
                      const os = fs.createWriteStream(`${options.uploadDir()}/full/${imageNameSaved}`);
                      is.on('end', ___err => {
                        if (!___err) {
                          fs.unlink(file.path, () => {
                            finish();
                          });
                          // generatePreviews();
                        } else {
                          console.log(___err);
                          finish();
                        }
                      });
                      is.pipe(os);
                    }
                  });
                });
              });
            });
          } else finish();
        });
      })
      .on('aborted', () => {
        _.each(tmpFiles, file => {
          const fileInfo = map[path.basename(file)];
          self.emit('abort', fileInfo);
          fs.unlink(file, () => {

          });
        });
      })
      .on('error', e => {
        self.emit('error', e);
      })
      .on('progress', bytesReceived => {
        if (bytesReceived > options.maxPostSize) {
          self.req.connection.destroy();
        }
      })
      .on('end', finish)
      .parse(self.req);
  };

  UploadHandler.prototype.destroy = async function () {
    const self = this;

    self.callback({ success: true, status: 'Delete disabled for drafts posts' });
    // const fileName = path.basename(decodeURIComponent(this.req.body.file));
    // const constfileNameParts = fileName.split('.');
    // constfileNameParts.pop();
    // const imgId = constfileNameParts.join('.');

    // const imageMoidel = await Images.findOne({ where: { md5: imgId, UserId: this.req.user.id } });
    // if (!imageMoidel) {
    //   self.emit('delete', fileName);
    //   self.callback({ success: false });
    //   return;
    // }

    // const filepath = path.join(options.uploadDir(), 'full', fileName);
    // if (filepath.indexOf(options.uploadDir()) !== 0) {
    //   await imageMoidel.destroy();
    //   self.emit('delete', fileName);
    //   self.callback({ success: false });
    //   return;
    // }
    // fs.unlink(filepath, async ex => {
    //   if (!ex) {
    //     _.each(options.imageVersions, (value, version) => {
    //       fs.unlink(path.join(options.uploadDir(), version, fileName), vex => {
    //         if (vex) console.error(vex);
    //       });
    //     });
    //   }
    //   await imageMoidel.destroy();
    //   self.emit('delete', fileName);
    //   self.callback({ success: !ex });
    // });
  };

  UploadHandler.prototype.initUrls = function (fileInfo, cb) {
    const baseUrl = `${options.ssl ? 'https:' : 'http:'}//${options.hostname || this.req.get('Host')}`;
    delete fileInfo.file;
    fileInfo.setUrl(null, `${baseUrl}${options.uploadUrl()}/full`);
    fileInfo.setUrl('delete', `${baseUrl}${this.req.originalUrl}`);
    async.each(
      Object.keys(options.imageVersions),
      (version, _cb) => {
        // fs.exists(`${options.uploadDir()}/${version}/${fileInfo.rename}`, exists => {
        //   if (exists) fileInfo.setUrl(version, `${baseUrl + options.uploadUrl()}/${version}`);
        //   _cb(null);
        // });
        fileInfo.setUrl(version, `${baseUrl + options.uploadUrl()}/${version}`);
        _cb(null);
      },
      cb
    );
  };

  return UploadHandler;
};
