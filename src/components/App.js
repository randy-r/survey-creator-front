import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { withRouter } from 'react-router';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Button, Drawer, Toolbar } from 'react-md';
import NavItemLink from './NavItemLink';

// import Inbox from './Inbox';
// import Starred from './Starred';
// import SendMail from './SendMail';
// import Drafts from './Drafts';

const TO_PREFIX = '';

const navItems = [{
  label: 'Inbox',
  to: '/',
  exact: true,
  icon: 'inbox',
}, {
  label: 'Starred',
  to: `${TO_PREFIX}/starred`,
  icon: 'star',
}, {
  label: 'Send mail',
  to: `${TO_PREFIX}/send-mail`,
  icon: 'send',
}, {
  label: 'Drafts',
  to: `${TO_PREFIX}/drafts`,
  icon: 'drafts',
}];

const Bla = () => <div>Bla</div>

class RoutingExample extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };
  state = { visible: false };

  componentDidMount() {
    // Need to set the renderNode since the drawer uses an overlay
    this.dialog = document.getElementById('drawer');
  }

  showDrawer = () => {
    this.setState({ visible: true });
  };

  hideDrawer = () => {
    this.setState({ visible: false });
  };

  handleVisibility = (visible) => {
    this.setState({ visible });
  };

  render() {
    const { location } = this.props;
    const { visible } = this.state;

    return (
      <div>
        <Toolbar colored fixed title="Routing Example" nav={<Button icon onClick={this.showDrawer}>menu</Button>} />
        <TransitionGroup
          component="div"
          className="md-toolbar-relative md-grid"
        >
          <Switch >
            <Route path={navItems[0].to} exact component={() => 'thg'} />
            <Route path={navItems[1].to} component={() => 'dsa'} />
            <Route path={navItems[2].to} component={Bla} />
            <Route path={navItems[3].to} component={Bla} />
          </Switch>
        </TransitionGroup>
        <Drawer
          type={Drawer.DrawerTypes.TEMPORARY}
          visible={visible}
          onVisibilityChange={this.handleVisibility}
          header={<Toolbar title={<Link to="/components/drawers#react-router-example">Drawer examples</Link>} />}
          renderNode={this.dialog}
          navItems={navItems.map(props => <NavItemLink {...props} key={props.to} />)}
        />
      </div>
    );
  }
}

const Routed = withRouter(RoutingExample);

const Wrapper = () => (
  <Router >
    <Fragment>
      <Routed />
    </Fragment>
  </Router>
)


export default Wrapper;