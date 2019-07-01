/* eslint-disable react/no-array-index-key, max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import withStyles from '@material-ui/core/styles/withStyles';
import { getContrastRatio } from '@material-ui/core/styles/colorManipulator';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import HelpIcon from 'components/Icons/Help';
import CloudUploadIcon from 'components/Icons/Camera';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
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
  active: {},
  uploadIcon: {
    'pointer-events': 'none',
    borderRadius: 10,
    '-webkit-border-radius': 10,
    padding: 15,
    '&$active': {
      fill: 'rgba(0, 0, 0, 0.9)',
      color: 'rgba(0, 0, 0, 0.9)'
    }
  },
  uploadIconBorder: {
    border: 'solid 2px rgba(0,0,0,.15)'
  },
  uploadIconSize: {
    width: '65px',
    height: '65px'
  },
  uploadIconSizeLarge: {
    width: '90px',
    height: '90px'
  },
  dropZone: {
    position: 'relative',
    width: '100%',
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
    height: '100px',
    width: 'initial',
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
  previewNatural: {
    height: 'auto'
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
    ' -ms-transform': 'translate(-50%, -50%)'
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
  },
  hintButton: {
    minWidth: 0,
    padding: 0,
    margin: 0
  },
  hintIcon: {
    width: 15,
    height: 15
  },
  arrowPopper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrowArrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: 'transparent transparent rgba(49,49,47,.99) transparent'
      }
    },
    '&[x-placement*="top"] $arrowArrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: 'rgba(49,49,47,.99) transparent transparent transparent'
      }
    },
    '&[x-placement*="right"] $arrowArrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: 'transparent rgba(49,49,47,.99) transparent transparent'
      }
    },
    '&[x-placement*="left"] $arrowArrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: 'transparent transparent transparent rgba(49,49,47,.99)'
      }
    }
  },
  arrowArrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    }
  }
};

@connect(
  null,
  {
    notifSend: notifActions.notifSend
  }
)
@withStyles(styles, { name: 'WMDropZoneSingle' })
export default class DropZoneSingle extends React.Component {
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
    maxSize: PropTypes.number,
    contratsBackground: PropTypes.bool,
    iconWithBorder: PropTypes.bool,
    previewNatural: PropTypes.bool,
    enabledTitle: PropTypes.bool,
    hint: PropTypes.bool,
    hintTitle: PropTypes.string,
    hintDescription: PropTypes.string,
    sizeIcon: PropTypes.string,
    titleWithoutImage: PropTypes.string,
    titleWithImage: PropTypes.string,
    imageContainerClass: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  };

  static defaultProps = {
    filesLimit: 1,
    maxSize: 6000000,
    contratsBackground: false,
    sizeIcon: 'normal',
    iconWithBorder: true,
    previewNatural: false,
    hint: false,
    hintTitle: 'Add image',
    hintDescription: '',
    showPreviews: true,
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
    ],
    enabledTitle: true,
    titleWithoutImage: 'Add image...',
    titleWithImage: 'Change image',
    description: 'The image should have a max width of 600px and height of 175px.',
    imageContainerClass: ''
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

  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  // handleClose() {
  //   this.props.closeDialog();
  //   this.setState({ open: false });
  // }

  handleHoverButton = e => {
    e.preventDefault();
  };

  render() {
    const {
      contratsBackground,
      iconWithBorder,
      hint,
      hintTitle,
      hintDescription,
      showPreviews,
      maxSize,
      classes,
      enabledTitle,
      titleWithoutImage,
      titleWithImage,
      description,
      sizeIcon,
      previewNatural,
      imageContainerClass
    } = this.props;
    const {
      files, acceptedFiles, disabled, arrowRef
    } = this.state;
    let img;
    let previews = '';
    const fileSizeLimit = maxSize;

    const contrastThreshold = 3;
    const backgroundContrast = contratsBackground && getContrastRatio(`#${contratsBackground}`, '#000') <= contrastThreshold
      ? { fill: '#fff', color: '#fff' }
      : {};

    if (showPreviews === true) {
      previews = files.map((file, i) => {
        const path = file.preview || file.path;

        if (isImage(file)) {
          // show image preview.
          img = (
            <img
              alt={`preview ${i}`}
              className={classNames(classes.smallPreviewImg, { [classes.previewNatural]: previewNatural })}
              src={path}
            />
          );
        } else {
          // Show default file image in preview.
          img = <FileIcon className={classes.smallPreviewImg} />;
        }

        return (
          <div
            className={classNames(classes.imageContainer, classes.fileIconImg, imageContainerClass)}
            key={`imgpreview-${i}`}
          >
            {img}
            <Button
              style={backgroundContrast}
              className={classes.removeBtn}
              onClick={e => {
                e.stopPropagation();
                this.handleRemove(file, i);
              }}
            >
              Remove
            </Button>
          </div>
        );
      });
    }

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
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Grid container spacing={5}>
              {enabledTitle && !!description && (
                <Grid item xs={7}>
                  {!!enabledTitle && (
                    <Typography className={classes.buttonText}>
                      {files.length === 0 ? titleWithoutImage : titleWithImage}
                    </Typography>
                  )}
                  <Typography variant="caption">{description}</Typography>
                </Grid>
              )}
              <Grid item xs={!enabledTitle && !description ? 12 : 5}>
                {files.length === 0 && (
                  <Button
                    disableFocusRipple
                    className={classNames(classes.uploadIcon, {
                      [classes.active]: isDragActive,
                      [classes.uploadIconBorder]: iconWithBorder
                    })}
                    style={backgroundContrast}
                  >
                    <CloudUploadIcon
                      className={classNames({
                        [classes.uploadIconSize]: sizeIcon === 'normal',
                        [classes.uploadIconSizeLarge]: sizeIcon === 'large'
                      })}
                    />
                  </Button>
                )}
                {!!hint && (
                  <Typography style={backgroundContrast} variant="caption" align="center">
                    {hintTitle}
                    {' '}
                    <Tooltip
                      placement="bottom"
                      title={(
                        <React.Fragment>
                          {hintDescription}
                          <span className={classes.arrowArrow} ref={this.handleArrowRef} />
                        </React.Fragment>
                      )}
                      classes={{ popper: classes.arrowPopper }}
                      PopperProps={{
                        popperOptions: {
                          modifiers: {
                            arrow: {
                              enabled: Boolean(arrowRef),
                              element: arrowRef
                            }
                          }
                        }
                      }}
                    >
                      <Button className={classes.hintButton}>
                        <HelpIcon style={backgroundContrast} className={classNames(classes.hintIcon)} />
                      </Button>
                    </Tooltip>
                  </Typography>
                )}
                {files.length !== 0 && previews}
              </Grid>
            </Grid>
          </div>
        )}
      </Dropzone>
    );
  }
}
