import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Rating from 'react-rating';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import BookingForm from 'components/BookingForm/BookingForm';
import IconArrowDown from '@material-ui/icons/ArrowDropDown';
import IconPerson from '@material-ui/icons/Person';
import clsx from 'clsx';

const numberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'code' });

const useStyles = makeStyles(theme => ({
  containerImage: {
    position: 'relative'
  },
  imageContainer: {
    position: 'relative',
    height: '100%'
  },
  image: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    minHeight: 100,
    backgroundSize: 'cover',
    backgroundOrigin: 'border-box',
    backgroundPosition: '50% 50%',
  },
  container: {
    border: '1px solid #dcdcdc',
    padding: 10,
    backgroundColor: '#fafafa'
  },
  active: {
    borderColor: '#000',
  },
  containerDesc: {
    paddingTop: 20,
    fontSize: 16
  },
  iconstarEmpty: {
    width: 16,
    height: 16
  },
  iconstarFull: {
    width: 16,
    height: 16,
    fill: 'orange'
  },
  separator: {
    marginLeft: 8,
    marginRight: 8,
    color: '#d0d0d0'
  },
  buttonReserv: {
    backgroundColor: 'orange',
    color: 'white'
  },
  gridContDescLeft: {
    position: 'relative',
    minHeight: 170
  },
  contFooterLeft: {
    position: 'absolute',
    bottom: 20
  },
  dir: {
    fontSize: 13
  },
  orangeBar: {
    height: 10,
    backgroundColor: 'orange',
    marginBottom: 10,
    marginLeft: 39
  },
  priceBox: {
    fontSize: 13,
    textAlign: 'right',
    backgroundColor: '#737373',
    position: 'relative',
    marginLeft: 39,
    height: 65,
    color: 'white',
    padding: 5,
    '&:before': {
      content: '""',
      width: 0,
      height: 65,
      position: 'absolute',
      top: 0,
      left: -19,
      borderRight: '19px solid #737373',
      borderTop: '19px solid transparent',
      borderBottom: '19px solid transparent',
    }
  },
  price: {
    fontWeight: 'bolder'
  },
  taxesText: {
    marginTop: 4,
    fontSize: 13
  },
  containerRooms: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  tableCell: {
    fontSize: 12,
    padding: '14px 0px 14px 16px'
  },
  tableCellStatus: {
    color: 'orange',
    textTransform: 'uppercase'
  },
  tableCellRequest: {
    textTransform: 'uppercase'
  },
  table: {
    minWidth: 650,
  },
  button: {
    fontSize: 12,
    color: '#4287f5'
  },
  buttonBookRoom: {
    backgroundColor: '#4287f5',
    border: '1px solid #4287f5',
    '&:hover': {
      backgroundColor: '#fff',
      border: '1px solid #4287f5',
      color: '#4287f5'
    }
  },
  dialogConfirmBody: {
    marginTop: 50,
    marginBottom: 50
  },
  containerRoomDetails: {
    margin: 20
  },
  buttonMarginRight: {
    marginRight: 8
  },
  iconPersonCont: {
    marginLeft: 30,
    display: 'inline-flex',
    alignItems: 'center'
  },
  flex: {
    display: 'flex'
  },
  hotelRoomDetailsDate: {
    borderBottom: '1px solid blue',
    marginTop: 20,
    display: 'inline-block',
    width: 80,
    textAlign: 'center'
  },
  hotelRoomDetailsPrice: {
    display: 'inline-block',
    width: 80,
    textAlign: 'center',
    '& span': {
      color: 'orange'
    }
  },
  containerDetailsRoomsLeft: {
    borderTop: '1px solid #dcdcdc',
    marginTop: 20,
    paddingTop: 20
  },
  containerDetailsRoomsRight: {
    borderTop: '1px solid #dcdcdc',
    marginTop: 20,
    paddingTop: 20,
    marginLeft: 20,
    '& > div:not(:first-child)': {
      borderTop: '1px solid #dcdcdc',
      paddingTop: 20,
      paddingBottom: 20
    },
    '& > div:first-child': {
      paddingBottom: 20
    },
    '& > div > span': {
      width: 90,
      textAlign: 'right',
      display: 'inline-block'
    }
  },
  textBoldDetails: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  textDetails: {
    fontSize: 13,
  }
}), { name: 'HotelCard' });

const SVGIcon = props => (
  <svg className={props.className} pointerEvents="none">
    <use xlinkHref={props.href} />
  </svg>
);

const HotelCard = React.memo(({
  hotel, submit, active, onSelect
}) => {
  const classes = useStyles();

  const formEl = React.useRef(null);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [showDetailsRoom, setShowDetailsRoom] = React.useState(false);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogConfirm, setOpenDialogConfirm] = React.useState(false);

  const handleShowDetailsRoom = row => () => {
    setShowDetailsRoom(prev => row === prev ? false : row);
  };
  const handleClickOpenDialog = room => () => {
    setOpenDialog(room);
  };

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function handleBooking() {
    formEl.current.submit();
  }

  function handleToggle() {
    setOpenDetails(prevOpen => !prevOpen);
    onSelect(hotel);
  }

  function handleCloseDialogConfirm() {
    setOpenDialogConfirm(false);
  }

  async function onSubmit(values) {
    return submit(values).then(() => {
      setOpenDialog(false);
      setOpenDialogConfirm(true);
    });
  }

  return (
    <div className={clsx(classes.container, { [classes.active]: openDetails || active })}>
      <Grid container spacing={2}>
        <Grid item xs={4} className={classes.containerImage}>
          <div className={classes.imageContainer}>
            <NoSsr>
              <div
                style={{ backgroundImage: `url(${hotel.image})` }}
                className={classes.image}
              />
            </NoSsr>
          </div>
        </Grid>
        <Grid item xs={8} className={classes.gridContDescLeft}>
          <div className={classes.containerDesc}>
            <Grid container>
              <Grid item xs={8}>
                <div>
                  <Link className="links" to="/">{hotel.name}</Link>
                  <span className={classes.separator}>|</span>
                  <Rating
                    initialRating={hotel.rating}
                    emptySymbol={<SVGIcon href="#icon-star-empty" className={classes.iconstarEmpty} />}
                    fullSymbol={<SVGIcon href="#icon-star-full" className={classes.iconstarFull} />}
                  />
                </div>
                <Typography className={classes.dir} variant="caption">
                  {hotel.address}
,
                  {' '}
                  {hotel.city}
                  <br />
                  {hotel.state}
                  {' '}
                  {hotel.zip}
                  {' '}
                  {hotel.country}
                </Typography>
                <div className={classes.contFooterLeft}>
                  <Button
                    onClick={handleToggle}
                    variant="contained"
                    className={classes.buttonReserv}
                  >
                    <IconArrowDown />
                    {' '}
View Rooms / Availability
                  </Button>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={classes.orangeBar} />
                <div className={classes.priceBox}>
Starting at
                  {' '}
                  <br />
                  USD
                  {' '}
                  <span className={classes.price}>{hotel.price}</span>
                  <br />
                  per room / night
                </div>
                <Typography
                  className={classes.taxesText}
                  variant="body2"
                  align="right"
                >
                  *
Taxes Not Included
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      {openDetails && (
        <Paper className={classes.containerRooms}>
          <Table className={classes.table}>
            <TableBody>
              {hotel.rooms.map(row => (
                <>
                  <TableRow key={row.name}>
                    <TableCell className={classes.tableCell} component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell className={`${classes.tableCell} ${classes.tableCellStatus}`} align="right">{row.status}</TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      <Button onClick={(handleShowDetailsRoom(row))} size="small" className={classes.button}>
                        <IconArrowDown />
                        {' '}
DETAILS
                      </Button>
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      {row.price}
                      {' '}
USD Per Night
                    </TableCell>
                    <TableCell className={`${classes.tableCell} ${classes.tableCellRequest}`} align="right">
                      {row.status === 'Available' ? (
                        <Button
                          onClick={handleClickOpenDialog(row)}
                          size="small"
                          className={classes.button}
                        >
REQUEST
                        </Button>
                      ) : 'Not Available'}
                    </TableCell>
                  </TableRow>
                  {showDetailsRoom === row && (
                    <TableRow key={`${row.name}-details`}>
                      <TableCell className={classes.tableCell} colSpan={5}>
                        <div className={classes.containerRoomDetails}>
                          <Grid container>
                            <Grid item xs={12} className={classes.flex}>
                              <Button
                                className={classes.buttonMarginRight}
                                size="small"
                                variant="contained"
                                color="primary"
                              >
                          King
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                              >
                          Daybed
                              </Button>
                              <div className={classes.iconPersonCont}>
                                <IconPerson />
                                <IconPerson />
                                <IconPerson />
                              </div>
                            </Grid>
                            <Grid item xs={12}>
                              <span className={classes.hotelRoomDetailsDate}>Fri, Dec 9</span>
                              <br />
                              <span className={classes.hotelRoomDetailsPrice}>
                                <span>
                                  {row.price}
                                </span>
                                {' '}
                            USD
                              </span>
                            </Grid>
                            <Grid xs={12} sm={8}>
                              <div className={classes.containerDetailsRoomsLeft}>
                                {!!row.has_promos && (
                                  <div>
                                    <Typography className={classes.textBoldDetails} variant="body2">Conditions and Offers:</Typography>
                                    <Typography className={classes.textDetails} variant="body2">Meal Plan: Breakfast Included</Typography>
                                  </div>
                                )}
                                <div>
                                  <br />
                                  <Typography className={classes.textBoldDetails} variant="body2">Cancelation Policy:</Typography>
                                  <Typography className={classes.textDetails} variant="body2" color="error">Penality of 1 booked night(s) when canceling after Nov 25, 2006 4:00 PM</Typography>
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <div className={classes.containerDetailsRoomsRight}>
                                <div>
                                  <span>Price:</span>
                                  <span>{numberFormat.format(row.price)}</span>
                                </div>
                                <div>
                                  <span>Taxes 14%:</span>
                                  <span>{numberFormat.format(row.price * 0.14)}</span>
                                </div>
                                <div>
                                  <span>Fees 0.00 p/nt:</span>
                                  <span>USD 0.00</span>
                                </div>
                                <div>
                                  <span>Total:</span>
                                  <span>{numberFormat.format(row.price * 1.14)}</span>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      {openDialog && (
        <Dialog open={!!openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            {openDialog.name}
            {' '}
            <br />
            {' '}
            <Typography variant="body2">Booking</Typography>
          </DialogTitle>
          <DialogContent>
            <BookingForm key={`hotel-${hotel.id}-room-${openDialog.id}`} initialValues={{ hotel_id: hotel.id, room_id: openDialog.id }} onSubmit={onSubmit} ref={formEl} />
            <br />
            <Typography component="div" variant="caption">
Room Cost:
              {' '}
              {numberFormat.format(openDialog.price)}
            </Typography>
            <Typography component="div" variant="caption">
Taxes:
              {' '}
              {numberFormat.format(openDialog.price * 0.14)}
            </Typography>
            <Typography component="div" variant="caption">
Fees:
              {' '}
              {numberFormat.format(0)}
            </Typography>
            <Typography component="div" variant="caption">
Booking Total:
              {' '}
              {numberFormat.format(openDialog.price * 1.14)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
            Cancel
            </Button>
            <Button variant="contained" className={classes.buttonBookRoom} onClick={handleBooking} color="primary">
            Book Room
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {openDialogConfirm && (
        <Dialog open={!!openDialogConfirm} onClose={handleCloseDialogConfirm} aria-labelledby="form-dialog-title">
          <DialogContent>
            <DialogContentText className={classes.dialogConfirmBody}>
            Thank for your booking! You will recieve confirmation via email within 24 hours
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
});

HotelCard.defaultProps = {
  hotel: {
    name: 'Sunset Key Guest Cottages',
    rating: 2,
    image: 'https://s-ec.bstatic.com/images/hotel/max1024x768/880/88090282.jpg',
    address: '245 Front Street',
    city: 'Key West',
    state: 'FL',
    zip: '33040',
    country: 'USA',
    rooms: [
      {
        name: 'Studio Suite City View',
        status: 'Available',
        price: 593
      }
    ]
  }
};

export default HotelCard;
