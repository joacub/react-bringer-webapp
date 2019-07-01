import React, { Component } from 'react';
import PropTypes from 'prop-types';

const authorizeUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token=';

const getOAuthToken = callback => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function onreadystatechange() {
    if (this.readyState == 4) {
      if (this.status === 0) {
        return callback('Internet Disconnected/Connection Timeout');
      }

      try {
        const response = JSON.parse(this.response);
        callback(null, response);
      } catch (error) {
        callback(error.message);
      }
    }
  };
  xhr.open('GET', '/api/social/?twitter=1', true);
  xhr.send();
};

const getUrlQueryObject = queryString => {
  const vars = {}; let
    hash;
  if (!queryString) {
    return false;
  }
  const hashes = queryString.slice(1).split('&');
  for (let i = 0; i < hashes.length; i += 1) {
    hash = hashes[i].split('=');
    // eslint-disable-next-line prefer-destructuring
    vars[hash[0]] = hash[1];
  }
  return vars;
};

const sendError = (message, callback) => {
  const response = {
    success: false,
    message: message || 'Some Error Occurred'
  };
  if (typeof callback === 'function') {
    callback(response);
  }
};

class TwitterLogin extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    textButton: PropTypes.string,
    typeButton: PropTypes.string,
    className: PropTypes.string,
    component: PropTypes.func.isRequired
  };

  static defaultProps = {
    textButton: 'Login with Twitter',
    typeButton: 'button',
    className: '',
  };

  click = () => {
    const { onLogin } = this.props;
    this.popup = window.open('', '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
    this.popup.document.write('Redirecting to twitter...');
    // Get an oauth token from the callback url
    getOAuthToken((error, response) => {
      if (error) {
        this.closePopup();
        return sendError(error, onLogin);
      }

      if (!response.success) {
        this.closePopup();
        return sendError(response.message, onLogin);
      }
      // Set the OAuth1 Token
      this.oauth_token = response.oauth_token;
      // Ask the user to authorize the app;
      this.authorize((_error, _response) => {
        if (error) {
          this.closePopup();
          return sendError(_error, onLogin);
        }
        if (!response || !response.oauth_token) {
          this.closePopup();
          return sendError('OAuth Token not Found', onLogin);
        }

        // Check if the oauth-token obtained in authorization, matches the original oauth-token
        if (response.oauth_token !== this.oauth_token) {
          return sendError('Invalid OAuth Token received from Twitter.', onLogin);
        }

        onLogin(_response);
      });
    });
  };

  authorize(callback) {
    if (!this.popup) {
      return callback('Popup Not initialized');
    }
    this.popup.location.href = authorizeUrl + this.oauth_token;
    const wait = () => {
      try {
        if (this.popup.location.origin === window.location.origin) {
          const response = getUrlQueryObject(this.popup.location.search);
          if (response && response.oauth_token && response.oauth_token && response.oauth_verifier) {
            callback(null, response);
            this.closePopup();
            return;
          }
        }
        if (!this.popup.closed) {
          setTimeout(() => wait(), 25);
        }
      } catch (e) {
        setTimeout(() => wait(), 25);
      }
    };
    wait();
  }

  closePopup() {
    if (this.popup && !this.popup.closed) {
      this.popup.close();
    }
  }

  render() {
    const {
      className, textButton, typeButton, component: WrappedComponent
    } = this.props;

    if (WrappedComponent) return <WrappedComponent twitterLogin={this.click} />;

    return (
      // eslint-disable-next-line
      <button className={className} onClick={this.click} type={typeButton}>
        {textButton}
      </button>
    );
  }
}

export default TwitterLogin;
