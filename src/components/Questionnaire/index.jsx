import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer, TextField, ExpansionPanel,
  ExpansionList
} from 'react-md';
import cn from 'classnames';

import { CreateQuestionnaireForm } from './CreateQuestionnaireForm';
import { List } from './List';

class CreateFakeQuestionnaireModal extends PureComponent {
  state = { visible: false };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    return (
      <Fragment>
        <Button onClick={this.show} floating primary>add</Button>
        <DialogContainer
          id="simple-action-dialog"
          visible={visible}
          onHide={this.hide}
          title="Create New Fake Questionnaire"
          width={"100vw"}
        >
          Select Trick Items
        </DialogContainer>
      </Fragment>

    );
  }
}


class CreateQuestionnaireModal extends PureComponent {
  state = { visible: false };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    return (
      <Fragment>
        <Button onClick={this.show} floating secondary>add</Button>
        <DialogContainer
          id="simple-action-dialog"
          visible={visible}
          onHide={this.hide}
          title="Create New Questionnaire"
          width={"100vw"}
        >
          <CreateQuestionnaireForm onSaveCallback={this.hide} onCancelCallback={this.hide} />
        </DialogContainer>
      </Fragment>
    );
  }
}


class QuestionnairePage extends Component {

  render() {
    return (
      <Fragment>
        <CreateQuestionnaireModal />
        <CreateFakeQuestionnaireModal />
        <div style={{ height: '1vh' }} />
        <List resource="questionnaires" />
      </Fragment>
    );
  }
}


export { QuestionnairePage }
