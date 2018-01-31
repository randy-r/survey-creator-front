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
import { TrickItemsPage } from './TrickItem';
import { AnswerTemplatesPage } from './AnswerTemplate';


const routesToTitle = new Map();
routesToTitle.set('surveys', 'Surveys');
routesToTitle.set('questionnaires', 'Questionnaires');
routesToTitle.set('items', 'Items');
routesToTitle.set('fakequestionnaires', 'Fake Questionnaires');
routesToTitle.set('trickitems', 'Trick Items');
routesToTitle.set('answertemplates', 'Answer Templates');

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
    const { location, history, match } = this.props;
    const matchedRoute = location.pathname.split('/')[1];
    const title = routesToTitle.get(matchedRoute);
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
            toolbarTitle={title}
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
              <Route path="/trickitems" exact component={TrickItemsPage} />
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