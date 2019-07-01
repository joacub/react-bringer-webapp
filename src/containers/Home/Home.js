import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import withStyles from '@material-ui/core/styles/withStyles';
import { load as getHotels, booking } from 'redux/modules/hotels';
import { connect } from 'react-redux';
import config from 'config';
import Container from 'components/Container/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import IconArrowDown from '@material-ui/icons/ArrowDropDown';
import IconArrowDownSort from '@material-ui/icons/ArrowDownwardOutlined';
import IconArrowUpSort from '@material-ui/icons/ArrowUpwardOutlined';
import IconRefresh from '@material-ui/icons/RefreshOutlined';
import HotelCard from 'components/Hotel/Card';

const stylesM = theme => ({
  containerGrey: {
    background: theme.palette.type === 'light' ? '#FFFFFF' : theme.palette.grey[900],
    padding: 15
  },
  containerWhite: {
    background: theme.palette.type === 'light' ? '#FFFFFF' : theme.palette.grey[900],
    padding: 15
  },
  containerSelectable: {
    cursor: 'pointer'
  },
  buttonMarginRight: {
    marginRight: theme.spacing(1)
  },
  paperRoot: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing(3)
  }),
  separator: {
    width: '100%',
    borderBottom: '1px solid #dcdcdc',
    marginTop: 15,
    marginBottom: 10
  },
  center: {
    textAlign: 'center'
  },
  containerContentHome: {
    overflow: 'hidden',
    marginTop: 20
  },
  commentsContainer: {
    height: 220
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  },
  root: {
    overflow: 'hidden'
  },
  noVisible: {
    visibility: 'hidden'
  },
  dividerSections: {
    position: 'relative',
    borderBottom: '1px solid rgba(0,0,0,.15)',
    maxWidth: 1000,
    margin: '24px auto'
  },
  containerAdsenseTop: {
    maxWidth: 1000,
    margin: '0 auto',
    textAlign: 'center'
  },
  inFeedAdsense: {
    paddingLeft: '0!important',
    paddingRight: '0!important'
  },
  alignRight: {
    textAlign: 'right'
  },
  iconRefresh: {
    fontSize: 18,
    marginRight: 4
  },
  containerMap: {
    overflow: 'hidden',
    width: '100%',
    height: 500
  },
  tooltipPopper: {
    zIndex: 99
  }
});

const options = [
  {
    label: 'Hotel Name', order: { name: -1 }, key: 'byname-down', icon: IconArrowDownSort
  },
  {
    label: 'Hotel Name', order: { name: 1 }, key: 'byname-up', icon: IconArrowUpSort
  },
  {
    label: 'Lower Price', order: { price: -1 }, key: 'lowerprice-down', icon: IconArrowDownSort
  },
  {
    label: 'Lower Price', order: { price: 1 }, key: 'lowerprice-up', icon: IconArrowUpSort
  },
  {
    label: 'Reset', order: { price: 1 }, key: 'reset-filter', icon: IconRefresh
  },
];

const getCurrentHotel = (props, state) => {
  const { hotels } = props;
  const { order, values } = state;
  const paramsSearch = {
    $skip: 0,
    $limit: 20,
    $paginate: false,
    $sort: {
      ...order
    }
  };

  if (values.name) {
    paramsSearch.name = {
      $like: `%${values.name.split(' ').join('%')}%`
    };
  }

  const key = JSON.stringify(paramsSearch);
  const currentHotels = hotels[key];
  return currentHotels;
};

@connect(
  state => ({
    loading: state.hotels && state.hotels.loading,
    hotels: state.hotels && state.hotels.hotels
  }),
  { getHotels, booking }
)
@withStyles(stylesM, { name: 'Home' })
export default class Home extends Component {
  timeoutLoadMore = null;

  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  markers = {};

  state = {
    values: {},
    open: false,
    selectedIndex: 3,
    anchorRef: React.createRef(),
    order: {
      price: 1
    },
    activeH: false
  };

  constructor(props) {
    super(props);
    this.anchorRef = React.createRef();
  }

  componentDidMount() {
    this.L = require('leaflet');
    this.posHotels();
  }

  componentDidUpdate() {
    this.posHotels();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loading } = nextProps;
    if (loading) {
      return false;
    }

    const currentHotels = getCurrentHotel(nextProps, nextState);
    if (!loading && currentHotels === undefined) {
      return false;
    }

    return true;
  }

  handleChange = name => event => {
    const { getHotels: gh } = this.props;
    const { order } = this.state;
    const { value } = event.target;
    this.setState(prevState => ({ values: { ...prevState.values, [name]: value } }), () => {
      this.requestHotels();
    });
  };

  handleToggle = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  handleClose = event => {
    if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  }

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, open: false, order: options[index].order }, () => {
      this.requestHotels();
    });
  }

  requestHotels = () => {
    const { getHotels: gh } = this.props;
    const { order, values } = this.state;
    const paramsSearch = {
      $skip: 0,
      $limit: 20,
      $paginate: false,
      $sort: {
        ...order
      }
    };


    if (values.name) {
      paramsSearch.name = {
        $like: `%${values.name.split(' ').join('%')}%`
      };
    }
    const key = JSON.stringify(paramsSearch);
    return gh(paramsSearch, key);
  }

  submit = async values => {
    const { booking: b, getHotels: gh } = this.props;

    const {
      values: inputValues, order
    } = this.state;

    return b(values).then(async () => {
      await this.requestHotels();
      return values;
    });
  }

  clearFilters = () => {
    this.setState({ order: { price: 1 }, selectedIndex: 3 });
  }

  onSelect = hotel => {
    const [_lat, _lon] = hotel.geo.split('|');
    this.map.setView([_lat, _lon], 7);
  }

  posHotels() {
    const that = this;
    const currentHotels = getCurrentHotel(this.props, this.state);

    let newMarkers = false;
    const hotelsById = {};
    if (currentHotels) {
      currentHotels.forEach(h => {
        hotelsById[h.id] = true;
        if (!this.markers[h.id]) {
          newMarkers = true;
        }
      });
    }

    Object.keys(this.markers).forEach(k => {
      if (!hotelsById[k]) {
        this.map.removeLayer(this.markers[k]);
        delete this.markers[k];
      }
    });

    if (newMarkers && currentHotels && currentHotels[0]) {
      const [_lat, _lon] = currentHotels[0].geo.split('|');

      if (!this.map) {
        this.map = this.L.map('map').setView([_lat, _lon], 7);
        this.map.on('popupopen', e => {
          that.setState({ activeH: e.popup._source.options.h });
        })
          .on('popupclose', () => {
            that.setState({ activeH: false });
          });
        this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
      }

      currentHotels.forEach(h => {
        const [lat, lon] = h.geo.split('|');
        if(!this.markers[h.id]) {
          this.markers[h.id] = this.L.marker([lat, lon], { h }).addTo(this.map)
          .bindPopup(h.name);
        }
        
      });
    }
  }

  render() {
    const {
      classes,
      hotels
    } = this.props;

    const {
      values, open, selectedIndex, order, activeH
    } = this.state;

    const title = 'Bringer – Services';
    // eslint-disable-next-line
    const description =
      'Welcome to Bringer. Bringer';

    const ldjson = {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: config.domain,
      name: config.app.title,
      alternateName: 'Bringer',
      image: 'https://bringeraircargo.com/media/max_1600/1*NaXapbTluUAlP1Xmqib5mQ.png',
      sameAs: [
        'https://www.facebook.com/Bringer',
        'https://instagram.com/Bringer',
        'https://www.linkedin.com/company/Bringer/',
        'https://twitter.com/@Bringer'
      ]
    };

    const ldjsonOrg = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.app.title,
      legalName: 'Bringer CORP',
      email: 'mailto:contact@bringeraircargo.com',
      url: config.domain,
      // logo: 'https://bringeraircargo.com/media/max_1600/1*NaXapbTluUAlP1Xmqib5mQ.png',
      sameAs: [
        'https://www.facebook.com/Bringer',
        'https://instagram.com/Bringer',
        'https://www.linkedin.com/company/Bringer/',
        'https://twitter.com/@Bringer'
      ]
    };

    const currentHotels = getCurrentHotel(this.props, this.state);

    return (
      <React.Fragment>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href="https://bringeraircargo.com/" />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="twitter:title" content={title} />
          <meta name="og:description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta property="og:type" content="website" />
          <meta name="robots" content="index, follow" />
          <script type="application/ld+json">{JSON.stringify(ldjson)}</script>
          <script type="application/ld+json">{JSON.stringify(ldjsonOrg)}</script>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
            integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
            crossOrigin=""
          />
        </Helmet>
        <svg id="svg-source" style={{ display: 'none' }} version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <symbol id="icon-star-empty" viewBox="0 0 1024 1024">
              <title>star-empty</title>
              <path className="path1" d="M1024 397.050l-353.78-51.408-158.22-320.582-158.216 320.582-353.784 51.408 256 249.538-60.432 352.352 316.432-166.358 316.432 166.358-60.434-352.352 256.002-249.538zM512 753.498l-223.462 117.48 42.676-248.83-180.786-176.222 249.84-36.304 111.732-226.396 111.736 226.396 249.836 36.304-180.788 176.222 42.678 248.83-223.462-117.48z" />
            </symbol>
            <symbol id="icon-star-full" viewBox="0 0 1024 1024">
              <title>star-full</title>
              <path className="path1" d="M1024 397.050l-353.78-51.408-158.22-320.582-158.216 320.582-353.784 51.408 256 249.538-60.432 352.352 316.432-166.358 316.432 166.358-60.434-352.352 256.002-249.538z" />
            </symbol>
          </defs>
        </svg>
        <Container>
          <Grid container alignItems="center">
            <Grid item xs={12}>
              <Typography>
          Hotels search
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="search-hotel-by-name"
                label="Search by Hotel Name"
                className={classes.textField}
                value={values.name}
                onChange={this.handleChange('name')}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.alignRight}>
              <Button
                ref={this.anchorRef}
                className={classes.buttonMarginRight}
                variant="contained"
                aria-owns={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={this.handleToggle}
              >
                Sort
                {' '}
                <IconArrowDown />
              </Button>
              <Popper className={classes.tooltipPopper} open={open} anchorEl={this.anchorRef.current} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper id="menu-list-grow">
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList>
                          {options.map((option, index) => (
                            <MenuItem
                              key={option.key}
                              selected={index === selectedIndex}
                              onClick={event => this.handleMenuItemClick(event, index)}
                            >
                              <option.icon />
                              {option.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
              <Button onClick={this.clearFilters} variant="outlined">
                <IconRefresh className={classes.iconRefresh} />
                {' '}
Filters
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <div key="map" id="map" className={classes.containerMap} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                {currentHotels && currentHotels.map(hotel => (
                  <Grid key={`hotel-${hotel.id}`} item xs={12}>
                    <HotelCard key={`card-hotel-${hotel.id}`} active={activeH && activeH.id === hotel.id} onSelect={this.onSelect} submit={this.submit} hotel={hotel} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>

      </React.Fragment>
    );
  }
}
