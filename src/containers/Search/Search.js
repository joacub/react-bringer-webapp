import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { load as loadStories } from 'redux/modules/stories';
import VisibilitySensor from 'react-visibility-sensor';
import PlaceHolderLoading from 'components/Publications/PlaceholderLoading';
import Container from 'components/Container/Container';
import Sticky from 'react-stickynode';
import CardPostBig from 'components/Card/CardPostBig';
import withWidth from '@material-ui/core/withWidth';
import { Helmet } from 'react-helmet-async';
import config from 'config';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getImage } from 'utils/getImageLink';

const { domain, app } = config;

function WithWidth(props) {
  /* eslint-disable */
  const {
    width,
    classes,
    popular,
    publications,
    tags,
    keyword,
  } = props;
  /* eslint-enable */

  const publicationsForKey = publications[keyword] || [];
  return (
    <Sticky enabled={width !== 'xs'} top={100}>
      {tags && tags.total > 0
          && (
            <div className={classes.containerSectionSidebar}>
              <header className={classes.headingRelated}>
          Tags
              </header>
              {tags.data.map(tagRelated => {
                const { tag: t, slug } = tagRelated;
                return (
                  <Button
                    component={Link}
                    to={`/tag/${slug}`}
                    key={`tag-${slug}`}
                    className={classes.relatedTagButton}
                    size="small"
                    variant="outlined"
                  >
                    {t}
                  </Button>
                );
              })}
            </div>
          )}
      {publicationsForKey && publicationsForKey.length > 0 && (
        <React.Fragment>
          <header className={classes.headingRelated}>Publications</header>
          <Grid container>
            {publicationsForKey.map(pub => {
              const { name, description, slug } = pub;
              return (
                <Grid key={`pub-${slug}`} item xs={12}>
                  <Typography variant="h3">
                    <Link className={classes.linkHover} to={`/${slug}`}>
                      {name}
                    </Link>
                  </Typography>
                  <Typography variant="body2">{description}</Typography>
                </Grid>
              );
            })}
          </Grid>
        </React.Fragment>
      )}
    </Sticky>
  );
}

const Sidebar = withWidth()(WithWidth);

const styles = theme => ({
  inputSearch: {
    letterSpacing: 0,
    fontWeight: 300,
    fontStyle: 'normal',
    height: 80,
    padding: 0,
    width: '100%'
  },
  inputRoot: {
    fontSize: 52
  },
  containerHeader: {
    marginTop: 40,
    marginBottom: 40
  },
  relatedTagButton: {
    marginRight: 8,
    marginBottom: 8
  },
  headingPrefix: {
    color: 'rgba(0,0,0,.54)',
    fontSize: 15,
    letterSpacing: '.1em',
    textTransform: 'uppercase'
  },
  headerTitle: {
    letterSpacing: 0,
    fontWeight: 300,
    fontStyle: 'normal',
    fontSize: 34,
    textTransform: 'none'
  },
  headingRelated: {
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,.84)',
    fontSize: 18,
    letterSpacing: 0,
    paddingTop: 15,
    marginBottom: 10,
    borderTop: '1px solid rgba(0,0,0,.05)'
  },
  noVisible: {
    visibility: 'hidden'
  },
  containerSectionSidebar: {
    marginBottom: 50
  },
  linkHover: {
    '&:hover': {
      color: theme.palette.secondary.main
    }
  },
  tabsFlexContainer: {
    height: 48
  },
  tabsRoot: {
    padding: 0,
    position: 'relative',
    borderBottom: '0',
    '& > $tabsFlexContainer': {
      borderBottom: '0'
    }
  },
  scrollButtons: {
    position: 'absolute',
    left: 0,
    top: -1,
    bottom: 1,
    zIndex: 9999,
    background: '#fff',
    width: 'auto'
  },
  tabsScroller: {
    position: 'relative',
    bottom: -1,
    display: 'flex',
    height: 60,
    overflowY: 'hidden',
    // '& $tabsFlexContainer': {
    //   borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    // }
    '&+$scrollButtons': {
      left: 'auto',
      right: 0
    }
  },
  tabsIndicator: {
    height: 1,
    top: 46,
    backgroundColor: 'rgba(0, 0, 0, 0.54)'
  },
  '@global': {
    '.no-hiddenscroll': {
      '& $tabsScroller': {
        bottom: -4,
        height: 61,
      },
      '& $tabsIndicator': {
        top: 43,
      }
    },
  },
  tabRoot: {
    fontSize: 15.8,
    padding: 0,
    fontFamily: [
      'wm-content-sans-serif-font',
      'Lucida Grande',
      'Lucida Sans Unicode',
      'Lucida Sans',
      'Geneva',
      'Arial',
      'sans-serif'
    ].join(','),
    textTransform: 'initial',
    minWidth: 0,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.84)',
      opacity: 1
    },
    '&$tabSelected': {
      color: 'rgba(0, 0, 0, 0.84)',
      fontWeight: theme.typography.fontWeightMedium
    },
    '&:focus': {
      color: 'rgba(0, 0, 0, 0.84)'
    }
  },
  tabSelected: {},
  imagePubList: {
    width: 60,
    height: 60,
    borderRadius: 3
  },
  gridRight: {
    marginLeft: 'auto'
  }
});

@withStyles(styles, { name: 'Search' })
@connect(
  state => ({
    stories: state.stories && state.stories.stories,
    publications: state.publications && state.publications.search,
    hasMore: state.stories && state.stories.hasMore,
    loading: state.stories && state.stories.loading,
    tags: state.tags && state.tags.result
  }),
  { loadStoriesR: loadStories }
)
export default class Search extends Component {
  timeoutSearch = null;

  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    stories: PropTypes.objectOf(PropTypes.any).isRequired,
    publications: PropTypes.objectOf(PropTypes.any).isRequired,
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    loadStoriesR: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    hasMore: PropTypes.bool.isRequired
  };

  static defaultProps = {
    loading: true
  };

  state = {
    keyword: this.props.location.search.replace('?q=', '').replace(/%20/g, ' ') // eslint-disable-line
  };

  static getDerivedStateFromProps(props, state) {
    if (props.location === state.location) {
      return null;
    }
    const search = props.location.search.replace('?q=', '').replace(/%20/g, ' ');
    return {
      location: props.location,
      keyword: search
    };
  }

  renderPlaceHolderList = limit => {
    if (limit === 1) {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PlaceHolderLoading />
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PlaceHolderLoading />
        </Grid>
        <Grid item xs={12}>
          <PlaceHolderLoading />
        </Grid>
        <Grid item xs={12}>
          <PlaceHolderLoading />
        </Grid>
        <Grid item xs={12}>
          <PlaceHolderLoading />
        </Grid>
      </Grid>
    );
  };

  loadMore = () => {
    const { loadStoriesR, stories } = this.props;
    if (this.timeoutLoadMore) {
      clearTimeout(this.timeoutLoadMore);
    }
    this.timeoutLoadMore = setTimeout(() => {
      const { keyword } = this.state;
      const paramsSearch = {
        status: 'public',
        $skip: 0,
        $limit: 10,
        $paginate: false,
        search: keyword
      };
      const key = JSON.stringify(paramsSearch);
      paramsSearch.$skip += stories[key] ? stories[key].length : 0;
      loadStoriesR(paramsSearch, key);
    }, 50);
  };

  onKeyUp = e => {
    if (window.isMobile && e.key === 'Enter') {
      e.target.blur();
    }
  }

  change = e => {
    const { history, match: { params: { type } } } = this.props;
    const availableTabsValues = {
      '': '',
      publications: '/publications',
      tags: '/tags',
    };
    this.setState({ keyword: e.target.value }, () => {
      if (this.timeoutSearch) {
        clearTimeout(this.timeoutSearch);
      }
      this.timeoutSearch = setTimeout(() => {
        const { keyword } = this.state;
        history.push(`/search${availableTabsValues[type || '']}?q=${keyword}`);
      }, 1000);
    });
  };

  render() {
    const {
      classes, publications,
      tags,
      stories, hasMore, loading, location, match: { params: { type } }
    } = this.props;

    const { keyword } = this.state;

    const availableTabsValues = {
      '': 0,
      publications: 1,
      tags: 2,
    };

    const tabValue = availableTabsValues[type || ''];

    const paramsSearch = {
      status: 'public',
      $skip: 0,
      $limit: 10,
      $paginate: false,
      search: keyword
    };

    const key = JSON.stringify(paramsSearch);
    const storiesInTag = stories[key];
    const publicationsForKey = publications[keyword] || [];

    const title = `Search and find stories - ${app.title}`;
    const canonicalLink = `${domain}/search`;
    const urlShare = `${domain}/search${location.search}`;
    const description = 'Search and find the last stories and news.';

    return (
      <React.Fragment>
        <Helmet>
          <title>{title}</title>
          <meta name="title" content={title} />
          <link rel="canonical" href={canonicalLink} />
          <meta name="description" content={description} />

          <meta property="og:title" content={title} />
          <meta property="twitter:title" content={title} />
          <meta property="og:url" content={urlShare} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta name="robots" content="index, follow" />
          <meta name="twitter:card" content="summary" />
        </Helmet>
        <Container className={classes.containerHeader} size="publicationSize">
          <form
            action=""
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <TextField
              value={keyword}
              type="search"
              onKeyUp={this.onKeyUp}
              onChange={this.change}
              InputProps={{ classes: { root: classes.inputRoot } }}
              className={classes.inputSearch}
              placeholder="Search"
            />
          </form>
        </Container>
        <Container size="publicationSize" spacing={5}>
          <Grid container>
            <Grid item xs={12}>
              <Tabs
                variant="scrollable"
                scrollButtons="on"
                value={tabValue}
                onChange={this.handleChangeTab}
                classes={{
                  scrollButtons: classes.scrollButtons,
                  root: classes.tabsRoot,
                  indicator: classes.tabsIndicator,
                  scroller: classes.tabsScroller,
                  flexContainer: classes.tabsFlexContainer
                }}
              >
                <Tab
                  component={Link}
                  to={`/search${location.search}`}
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label="Stories"
                />
                <Tab
                  component={Link}
                  to={`/search/publications${location.search}`}
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label="Publications"
                />
                <Tab
                  component={Link}
                  to={`/search/tags${location.search}`}
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label="Tags"
                />
              </Tabs>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            {tabValue === 0 && (
              <Grid item xs={12} sm={9}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <header className={classes.headingRelated}>Stories</header>
                  </Grid>
                  {!storiesInTag && (
                    <Grid item xs={12}>
                      {this.renderPlaceHolderList(1)}
                    </Grid>
                  )}
                  {storiesInTag
                  && storiesInTag.map(story => (
                    <Grid key={`story-in-tag-${story.uid}`} item xs={12}>
                      <CardPostBig post={story} />
                    </Grid>
                  ))}
                  {hasMore && (
                    <VisibilitySensor partialVisibility>
                      {({ isVisible }) => {
                        if (isVisible && !loading) {
                          this.loadMore();
                        }
                        return (
                          <Grid item xs={12}>
                            <div key="stories-loader-0" className={!isVisible ? classes.noVisible : ''}>
                              {this.renderPlaceHolderList(1)}
                            </div>
                          </Grid>
                        );
                      }}
                    </VisibilitySensor>
                  )}
                </Grid>
              </Grid>
            )}
            {tabValue === 1 && publicationsForKey && (
              <Grid item xs={12} sm={9}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <header className={classes.headingRelated}><div className="clearfix" /></header>
                  </Grid>
                  {!storiesInTag && loading && (
                    <Grid item xs={12}>
                      {this.renderPlaceHolderList(1)}
                    </Grid>
                  )}
                  {publicationsForKey && publicationsForKey.length > 0
                && publicationsForKey.map(pub => {
                  const {
                    name, description: descriptionPub, slug, avatar
                  } = pub;
                  return (
                    <Grid key={`pub-${slug}`} item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs="auto">
                          <img className={classes.imagePubList} alt={`Logo ${name}`} src={getImage(avatar, 'fit_c_120x120')} />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="h3">
                            <Link className={classes.linkHover} to={`/${slug}`}>
                              {name}
                            </Link>
                          </Typography>
                          <Typography variant="body2">{descriptionPub}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
                  {hasMore && (
                    <VisibilitySensor partialVisibility>
                      {({ isVisible }) => {
                        if (isVisible && !loading) {
                          this.loadMore();
                        }
                        return (
                          <Grid item xs={12}>
                            <div key="stories-loader-0" className={!isVisible ? classes.noVisible : ''}>
                              {this.renderPlaceHolderList(1)}
                            </div>
                          </Grid>
                        );
                      }}
                    </VisibilitySensor>
                  )}
                </Grid>
              </Grid>
            )}
            {tabValue === 2 && tags
            && (
              <Grid item xs={12} sm={9}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <header className={classes.headingRelated}><div className="clearfix" /></header>
                  </Grid>
                  <Grid item xs={12}>
                    {tags.data.map(tagRelated => {
                      const { tag: t, slug } = tagRelated;
                      return (
                        <Button
                          component={Link}
                          to={`/tag/${slug}`}
                          key={`tag-${slug}`}
                          className={classes.relatedTagButton}
                          size="small"
                          variant="outlined"
                        >
                          {t}
                        </Button>
                      );
                    })}
                  </Grid>
                </Grid>
              </Grid>
            )}
            {tabValue === 0 && (
              <Grid item xs={12} sm={3}>
                <Sidebar {...this.props} keyword={keyword} />
              </Grid>
            )}
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}
