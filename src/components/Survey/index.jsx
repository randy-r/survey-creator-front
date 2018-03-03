import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer, TextField, ExpansionPanel,
  ExpansionList
} from 'react-md';
import cn from 'classnames';

import { CreateSurveyForm } from './CreateSurveyForm';
import { getSurveyPublicUrls, getToken, createAuthorizedRequest } from '../../utils';
import { List } from '../List';





class SimpleModal extends PureComponent {
  state = { visible: false };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false }, () => {
      // TODO, perform the updating of a list by pulling state up or using a state management lib and discard the quick hack bellow
      window.location.reload();
    });
  };

  render() {
    const { visible } = this.state;
    return (
      <div>
        <Button onClick={this.show} floating secondary>add</Button>
        <DialogContainer
          id="simple-action-dialog"
          visible={visible}
          onHide={this.hide}
          title="Create New Survey"
          width={"100vw"}
        >
          <CreateSurveyForm onSaveCallback={this.hide} onCancelCallback={this.hide} />
        </DialogContainer>
      </div>
    );
  }
}

class SurveyPage extends Component {

  render() {
    return (
      <Fragment>
        <SimpleModal />
        <div style={{ height: '1vh' }} />
        <List
          resource="surveys"
          createContentUrl={id => `/api/surveys/${id}?includeQuestionnaires=true`}
          titleRender={s => s.name ? s.name : "no-name"}
          renderContent={s => (
            <Fragment>
              <h4>public urls: </h4>
              {getSurveyPublicUrls(s.id).map(u => <p key={u}><a href={u}>{u}</a></p>)}
            </Fragment>
          )}
        />
      </Fragment>
    );
  }
}


export { SurveyPage }