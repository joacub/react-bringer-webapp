import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { add, remove } from 'eventlistener';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import parentScroll from './utils/parentScroll';
import inViewport from './utils/inViewport';

export default class LazyLoad extends Component {
  constructor(props) {
    super(props);

    this.lazyLoadHandler = this.lazyLoadHandler.bind(this);

    if (props.throttle > 0) {
      if (props.debounce) {
        this.lazyLoadHandler = debounce(this.lazyLoadHandler, props.throttle);
      } else {
        this.lazyLoadHandler = throttle(this.lazyLoadHandler, props.throttle);
      }
    }

    this.state = { visible: false };
  }

  componentDidMount() {
    this._mounted = true;
    const eventNode = this.getEventNode();

    this.lazyLoadHandler();

    if (this.lazyLoadHandler.flush) {
      this.lazyLoadHandler.flush();
    }

    add(window, 'resize', this.lazyLoadHandler);
    add(eventNode, 'scroll', this.lazyLoadHandler);
  }

  componentWillReceiveProps() {
    const { visible } = this.state;
    if (!visible) {
      this.lazyLoadHandler();
    }
  }

  shouldComponentUpdate(_nextProps, nextState) {
    return nextState.visible;
  }

  componentWillUnmount() {
    this._mounted = false;
    if (this.lazyLoadHandler.cancel) {
      this.lazyLoadHandler.cancel();
    }

    this.detachListeners();
  }

  getEventNode() {
    return parentScroll(findDOMNode(this)); // eslint-disable-line
  }

  getOffset() {
    const {
      offset,
      offsetVertical,
      offsetHorizontal,
      offsetTop,
      offsetBottom,
      offsetLeft,
      offsetRight,
      threshold
    } = this.props;

    const _offsetAll = threshold || offset;
    const _offsetVertical = offsetVertical || _offsetAll;
    const _offsetHorizontal = offsetHorizontal || _offsetAll;

    return {
      top: offsetTop || _offsetVertical,
      bottom: offsetBottom || _offsetVertical,
      left: offsetLeft || _offsetHorizontal,
      right: offsetRight || _offsetHorizontal
    };
  }

  lazyLoadHandler() {
    if (!this._mounted) {
      return;
    }
    const offset = this.getOffset();
    const node = findDOMNode(this); // eslint-disable-line
    const eventNode = this.getEventNode();

    if (inViewport(node, eventNode, offset)) {
      const { onContentVisible } = this.props;

      this.setState({ visible: true }, () => {
        if (onContentVisible) {
          onContentVisible();
        }
      });
      this.detachListeners();
    }
  }

  detachListeners() {
    const eventNode = this.getEventNode();

    remove(window, 'resize', this.lazyLoadHandler);
    remove(eventNode, 'scroll', this.lazyLoadHandler);
  }

  render() {
    const {
      children, className, height, width, elementType
    } = this.props;
    const { visible } = this.state;

    const elStyles = { height, width };
    const elClasses = `LazyLoad${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`;

    return React.createElement(
      elementType,
      {
        className: elClasses,
        style: elStyles
      },
      visible && Children.only(children)
    );
  }
}

LazyLoad.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string, //eslint-disable-line
  debounce: PropTypes.bool,
  elementType: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), //eslint-disable-line
  offset: PropTypes.number,
  offsetBottom: PropTypes.number,
  offsetHorizontal: PropTypes.number,
  offsetLeft: PropTypes.number,
  offsetRight: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetVertical: PropTypes.number,
  threshold: PropTypes.number, //eslint-disable-line
  throttle: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), //eslint-disable-line
  onContentVisible: PropTypes.func //eslint-disable-line
};

LazyLoad.defaultProps = {
  elementType: 'div',
  debounce: true,
  offset: 0,
  offsetBottom: 0,
  offsetHorizontal: 0,
  offsetLeft: 0,
  offsetRight: 0,
  offsetTop: 0,
  offsetVertical: 0,
  throttle: 250
};
