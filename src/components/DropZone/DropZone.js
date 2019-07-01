/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import withStyles from '@material-ui/core/styles/withStyles';
import ActionDelete from '@material-ui/icons/Clear';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import CloudUploadIcon from '@material-ui/icons/CameraAltOutlined';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'clsx';
import * as notifActions from 'redux/modules/notifs';
import formatBytes from 'utils/formatBytes';
import isImage from './helpers/helpers.js';

const styles = {
  '@keyframes progress': {
    '0%': {
      backgroundPosition: '0 0'
    },
    '100%': {
      backgroundPosition: '-70px 0'
    }
  },
  dropzoneTextStyle: {
    textAlign: 'center',
    top: '25%',
    position: 'relative'
  },
  uploadIconSize: {
    width: '51px !important',
    height: '51px !important',
    color: '#909090 !important'
  },
  dropzoneParagraph: {
    fontSize: 24
  },
  dropZone: {
    position: 'relative',
    width: '100%',
    height: 250,
    backgroundColor: '#F0F0F0',
    border: 'dashed',
    borderColor: '#C8C8C8',
    cursor: 'pointer'
  },
  stripes: {
    width: '100%',
    height: 250,
    cursor: 'pointer',
    border: 'solid',
    borderColor: '#C8C8C8',
    backgroundImage: 'repeating-linear-gradient(-45deg, #F0F0F0, #F0F0F0 25px, #C8C8C8 25px, #C8C8C8 50px)',
    animation: 'progress 2s linear infinite !important',
    animationName: '$progress',
    backgroundSize: '150% 100%'
  },
  rejectStripes: {
    width: '100%',
    height: 250,
    cursor: 'pointer',
    border: 'solid',
    borderColor: '#C8C8C8',
    backgroundImage: 'repeating-linear-gradient(-45deg, #fc8785, #fc8785 25px, #f4231f 25px, #f4231f 50px)',
    animation: 'progress 2s linear infinite !important',
    animationName: '$progress',
    backgroundSize: '150% 100%'
  },
  fileIconImg: {
    color: '#909090 !important'
  },
  smallPreviewImg: {
    height: '100px !important',
    width: 'initial !important',
    maxWidth: '100%',
    marginTop: 5,
    marginRight: 10,
    color: 'rgba(0, 0, 0, 0.87)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms !important',
    boxSizing: 'border-box',
    W: 'rgba(0, 0, 0, 0)',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px !important',
    borderRadius: 2,
    zIndex: '5'
  },
  imageContainer: {
    position: 'relative',
    zIndex: '10',
    '&:hover': {
      '& $smallPreviewImg': {
        opacity: '0.3'
      },
      '& $middle': {
        opacity: '1'
      },
      '& $middleBigPic': {
        opacity: '1'
      }
    }
  },
  removeBtn: {
    color: 'white',
    marginLeft: 5,
    zIndex: 3
  },
  middleBigPic: {},
  middle: {
    transition: '.5s ease',
    opacity: '0',
    position: 'absolute',
    top: 20,
    left: 5,
    transform: 'translate(-50%, -50%)',
  },
  row: {
    marginRight: '-0.5rem',
    marginLeft: '-0.5rem',
    boxSizing: 'border-box',
    display: 'flex',
    fallbacks: [
      {
        '-ms-flex-direction': 'row'
      },
      {
        '-ms-flex': '0 1 auto'
      },
      {
        '-webkit-box-orient': 'horizontal'
      },
      {
        '-webkit-box-flex': '0'
      },
      {
        display: '-ms-flexbox'
      },
      {
        display: '-webkit-box'
      }
    ],
    flex: '0 1 auto',
    '-webkit-box-direction': 'normal',
    '-ms-flex-wrap': 'wrap',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
};

@connect(
  null,
  {
    notifSend: notifActions.notifSend
  }
)
@withStyles(styles, { name: 'WMDropZone' })
export default class MaterialDropZone extends React.Component {
  state = {
    files: this.props.files, // eslint-disable-line
    disabled: false,
    acceptedFiles: this.props.acceptedFiles // eslint-disable-line
  };

  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    filesLimit: PropTypes.number,
    files: PropTypes.arrayOf(PropTypes.any),
    acceptedFiles: PropTypes.arrayOf(PropTypes.any),
    showPreviews: PropTypes.bool,
    disabled: PropTypes.bool, // eslint-disable-line
    deleteFile: PropTypes.func.isRequired,
    saveFiles: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired,
    maxSize: PropTypes.number
  };

  static defaultProps = {
    disabled: false,
    filesLimit: 1,
    showPreviews: true,
    files: [],
    maxSize: 6000000,
    acceptedFiles: [
      'image/jpeg',
      'image/png',
      'image/bmp',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  };

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    const { files } = this.state;
    for (let i = files.length; i >= 0; i -= 1) {
      const file = files[0];
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    }
  }

  onDrop = files => {
    let { files: oldFiles } = this.state;
    const { filesLimit: filesLimitProp, notifSend } = this.props;
    const filesLimit = filesLimitProp || 1;

    const filesWithPreview = files.map(file => {
      if (file.path) {
        return file;
      }
      return Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
    });
    oldFiles = oldFiles.concat(filesWithPreview);
    if (oldFiles.length > filesLimit) {
      notifSend({
        message: `Cannot upload more then ${filesLimit} items.`,
        kind: 'text',
        position: {
          vertical: 'top',
          horizontal: 'center'
        }
      });
    } else {
      this.setState({
        files: oldFiles
      });
    }
  };

  saveFiles = () => {
    const { filesLimit, saveFiles, notifSend } = this.props;
    const { files } = this.state;

    if (files.length > filesLimit) {
      notifSend({
        message: `Cannot upload more then ${filesLimit} items.`,
        kind: 'text',
        position: {
          vertical: 'top',
          horizontal: 'center'
        }
      });
    } else {
      saveFiles(files);
    }
  };

  onDropRejected = () => {
    const { notifSend, maxSize } = this.props;
    notifSend({
      message: `File too big, max size is ${formatBytes(maxSize)}`,
      kind: 'text',
      position: {
        vertical: 'top',
        horizontal: 'center'
      }
    });
  };

  handleRemove = (file, fileIndex) => {
    const { files } = this.state;
    const { deleteFile } = this.props;
    // This is to prevent memory leaks.
    URL.revokeObjectURL(file.preview);

    files.splice(fileIndex, 1);
    this.setState(files);

    if (file.path) {
      deleteFile(file);
    }
  };

  // handleClose() {
  //   this.props.closeDialog();
  //   this.setState({ open: false });
  // }

  render() {
    const { showPreviews, maxSize, classes } = this.props;
    const { files, acceptedFiles, disabled } = this.state;
    let img;
    let previews = '';
    const fileSizeLimit = maxSize;

    if (showPreviews === true) {
      previews = files.map((file, i) => {
        const path = file.preview || `/pic${file.path}`;

        if (isImage(file)) {
          // show image preview.
          img = <img alt={`preview ${i}`} className={classes.smallPreviewImg} src={path} />;
        } else {
          // Show default file image in preview.
          img = <FileIcon className={classes.smallPreviewImg} />;
        }

        return (
          <div className={classNames(classes.imageContainer, classes.col, classes.fileIconImg)} key={`imgpreview-${i}`}>
            {img}
            <div className={classes.middle}>
              <IconButton className={classes.removeBtn} onClick={() => this.handleRemove(file, i)}>
                <ActionDelete />
              </IconButton>
            </div>
          </div>
        );
      });
    }

    return (
      <React.Fragment>
        <Dropzone
          disabled={disabled}
          accept={acceptedFiles.join(',')}
          onDrop={this.onDrop}
          className={classes.dropZone}
          acceptClassName={classes.stripes}
          rejectClassName={classes.rejectStripes}
          onDropRejected={this.onDropRejected}
          maxSize={fileSizeLimit}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={classes.dropzoneTextStyle}>
                <p className={classes.dropzoneParagraph}>Drag and drop an image file here or click</p>
                <br />
                <CloudUploadIcon className={classes.uploadIconSize} />
              </div>
            </div>
          )}
        </Dropzone>
        <br />
        {showPreviews && (
          <React.Fragment>
            <div className={classes.row}>{files.length ? <span>Preview:</span> : ''}</div>
            <div className={classes.row}>{previews}</div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
