import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RootRef from '@material-ui/core/RootRef';

@connect((state, props) => {
  const { namespace } = props;
  return { notifs: state.notifs[namespace] || [] };
})
export default class Notifs extends Component {
  static propTypes = {
    notifs: PropTypes.arrayOf(PropTypes.object).isRequired,
    NotifComponent: PropTypes.elementType.isRequired,
    handleCloseNotif: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired
  };

  refsitemsRefs = {};

  shouldComponentUpdate(nextProps) {
    const { notifs } = this.props;
    return notifs !== nextProps.notifs;
  }

  render() {
    const {
      notifs, className, NotifComponent, handleCloseNotif
    } = this.props;
    const indexs = {};
    const calculateHeightsItems = {};
    const notifsReverse = notifs.reverse();
    return (
      <div className={`notif-container ${className}`}>
        {notifsReverse.map(notif => {
          const action = notif.action !== undefined ? notif.action : true;
          const position = notif.position
            ? notif.position
            : {
              vertical: 'bottom',
              horizontal: 'left'
            };
          const keyNoti = JSON.stringify(position);
          if (typeof indexs[keyNoti] === 'undefined') {
            calculateHeightsItems[keyNoti] = [];
            indexs[keyNoti] = 0;
          } else {
            indexs[keyNoti] += 1;
          }

          if (!this.refsitemsRefs[notif.id]) {
            this.refsitemsRefs[notif.id] = React.createRef();
          }

          let calculateHeights = 0;
          calculateHeightsItems[keyNoti].forEach(item => {
            if (item.current) {
              calculateHeights += item.current.clientHeight;
            }
          });

          calculateHeightsItems[keyNoti].push(this.refsitemsRefs[notif.id]);

          return (
            <RootRef key={`${notif.id}root-ref`} rootRef={this.refsitemsRefs[notif.id]}>
              <NotifComponent
                calculateHeights={calculateHeights}
                handleCloseNotif={handleCloseNotif}
                notifIndex={indexs[keyNoti]}
                key={`${notif.id}-notifwraper`}
                notifId={notif.id}
                message={notif.message}
                kind={notif.kind}
                position={position}
                action={action}
                actions={notif.actions}
              />
            </RootRef>
          );
        })}
      </div>
    );
  }
}
