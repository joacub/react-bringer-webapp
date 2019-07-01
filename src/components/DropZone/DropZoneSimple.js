/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import withStyles from '@material-ui/core/styles/withStyles';
import * as notifActions from 'redux/modules/notifs';
import formatBytes from 'utils/formatBytes';

const styles = {
  '@keyframes progress': {
    '0%': {
      backgroundPosition: '0 0'
    },
    '100%': {
      backgroundPosition: '-70px 0'
    }
  },
  uploadIcon: {
    border: 'solid 2px rgba(0,0,0,.15)',
    '-webkit-border-radius': 10,
    borderRadius: 10,
    padding: 15
  },
  uploadIconSize: {
    width: '65px',
    height: '65px'
  },
  dropZone: {
    position: 'relative',
    width: 'auto',
    cursor: 'pointer'
  },
  stripes: {
    '& $uploadIcon': {
      backgroundImage: 'repeating-linear-gradient(-45deg, #F0F0F0, #F0F0F0 25px, #C8C8C8 25px, #C8C8C8 50px)',
      animation: 'progress 2s linear infinite !important',
      animationName: '$progress',
      backgroundSize: '150% 100%'
    }
  },
  rejectStripes: {
    '& $uploadIcon': {
      backgroundImage: 'repeating-linear-gradient(-45deg, #fc8785, #fc8785 25px, #f4231f 25px, #f4231f 50px)',
      animation: 'progress 2s linear infinite !important',
      animationName: '$progress',
      backgroundSize: '150% 100%'
    }
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
    boxShadow: 'rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px !important',
    borderRadius: 2,
    zIndex: '5',
    display: 'block'
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
    zIndex: 3,
    padding: 0,
    minWidth: 'auto'
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
  },
  buttonText: {
    color: 'rgba(0,0,0,.84)',
    '&:hover': {
      color: 'rgba(0,0,0,.68)'
    }
  }
};

@connect(
  null,
  {
    notifSend: notifActions.notifSend
  }
)
@withStyles(styles, { name: 'WMDropZoneSimple' })
export default class DropZoneSimple extends React.Component {
  state = {
    files: this.props.files, // eslint-disable-line
    disabled: false,
    acceptedFiles: this.props.acceptedFiles // eslint-disable-line
  };

  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    filesLimit: PropTypes.number,
    children: PropTypes.node.isRequired,
    files: PropTypes.arrayOf(PropTypes.any),
    acceptedFiles: PropTypes.arrayOf(PropTypes.any),
    disabled: PropTypes.bool, // eslint-disable-line
    deleteFile: PropTypes.func.isRequired,
    saveFiles: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired,
    maxSize: PropTypes.number
  };

  static defaultProps = {
    maxSize: 6000000,
    filesLimit: 1,
    files: [],
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

    oldFiles = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
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
      this.setState(
        {
          files: oldFiles
        },
        () => {
          this.saveFiles();
        }
      );
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
    const { maxSize, classes, children } = this.props;
    const { acceptedFiles, disabled } = this.state;
    const fileSizeLimit = maxSize || 3000000;

    return (
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
            {children}
          </div>
        )}
      </Dropzone>
    );
  }
}
