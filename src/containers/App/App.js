import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import { provideHooks } from 'redial';
import Helmet from 'react-helmet';
import { Container, Message } from 'semantic-ui-react';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { Notifs } from 'components';
import config from 'config';
import Navigation from '../../components/Navigation/Navigation';

@provideHooks({
  fetch: async ({ store: { dispatch, getState } }) => {
    if (!isInfoLoaded(getState())) {
      await dispatch(loadInfo()).catch(() => null);
    }
  }
})
@connect(
  state => ({
    notifs: state.notifs
  }),
  { pushState: push }
)
@withRouter
export default class App extends Component {
  static propTypes = {
    route: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    notifs: PropTypes.shape({
      global: PropTypes.array
    }).isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { notifs, route } = this.props;
    const styles = require('./App.scss');

    const leftItems = [
      {
        as: 'Link',
        content: 'Feedback',
        key: 'feedback',
        to: '/feedback'
      }
    ];

    const rightItems = [];

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head} />
        <Navigation leftItems={leftItems} rightItems={rightItems}>
          <Container>
            {notifs.global && (
              <Notifs
                className={styles.notifs}
                namespace="global"
                NotifComponent={props => <Message warning>{props.message}</Message>}
              />
            )}
            {renderRoutes(route.routes)}
          </Container>
        </Navigation>
      </div>
    );
  }
}
