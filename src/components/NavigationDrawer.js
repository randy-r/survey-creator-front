/* eslint-disable react/no-array-index-key */
import React, { PureComponent, Fragment, Component } from 'react';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import {
  Button, DialogContainer,
  NavigationDrawer, SVGIcon, FontIcon,
  ListItem
} from 'react-md';
import withRouter from 'react-router-dom/withRouter';

import NavItemLink from './NavItemLink';
import { SurveyPage } from './Survey';
import { QuestionnairePage, FakeQuestionnairePage } from './Questionnaire';
import { ItemsPage } from './Item';
import { AnswerTemplatesPage } from './AnswerTemplate';


class Simple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderNode: null,
      visible: true,
    };
  }

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false, renderNode: null });
  };

  handleShow = () => {
    this.setState({ renderNode: document.getElementById('navigation-drawer-demo') });
  };

  getnavItems = () => {
    const { location, history, match } = this.props;
    // const { listItemPressed } = location.state;
    console.log(location);
    console.log(history);
    console.log(match);
    return [
      <NavItemLink to="/surveys" icon="assignment" label="Surveys" key="surveys" />,
      <NavItemLink to="/questionnaires" exact icon="view_agenda" label="Questionnaires" key="questionnaires" />,
      <NavItemLink to="/items" exact icon="view_module" label="Items" key="items" />,
      <NavItemLink to="/fakequestionnaires" exact icon="dns" label="Fake Questionnaires" key="fakequestionnaires" />,
      <NavItemLink to="/trickitems" exact icon="texture" label="Trick Items" key="trickitems" />,
      <NavItemLink to="/answertemplates" exact icon="radio_button_checked" label="Answer Templates" key="answertemplates" />,
    ];
  }

  render() {
    const { visible, renderNode } = this.state;
    return (
      <div>
        <DialogContainer
          id="navigation-drawer-demo"
          aria-label="Navigation Drawer Demo"
          visible={visible}
          fullPage
          focusOnMount={false}
          onShow={this.handleShow}
          onHide={this.hide}
        >
          <NavigationDrawer
            renderNode={renderNode}
            navItems={this.getnavItems()}
            mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
            tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
            desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
            toolbarTitle="Survey Creator - Admin Panel"
            contentId="main-demo-content"
            temporaryIcon={<FontIcon>menu</FontIcon>}
            persistentIcon={<FontIcon iconClassName="fa fa-arrow-left" />}
            contentClassName="md-grid"
          >
            <section className="md-text-container md-cell md-cell--12">
              <Route path="/surveys" exact component={SurveyPage} />
              <Route path="/questionnaires" exact component={QuestionnairePage} />
              <Route path="/items" exact component={ItemsPage} />
              <Route path="/fakequestionnaires" exact component={FakeQuestionnairePage} />
              <Route path="/trickitems" exact render={() => 'trickitems'} />
              <Route path="/answertemplates" exact component={AnswerTemplatesPage} />
            </section>
          </NavigationDrawer>
        </DialogContainer>
      </div>
    );
  }
}

const Routed = withRouter(Simple);

const Wrapper = () => (
  <Router >
    <Fragment>
      <Routed />
    </Fragment>
  </Router>
)

export default Wrapper;