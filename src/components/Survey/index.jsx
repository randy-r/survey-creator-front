import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer, TextField, ExpansionPanel,
  ExpansionList
} from 'react-md';
import cn from 'classnames';

import { CreateSurveyForm } from './CreateSurveyForm';
import { getSurveyPublicUrls } from '../../utils';


class SurveyList extends Component {

  state = { surveys: [] }

  componentDidMount() {
    fetch('/api/surveys')
      .then(response => {
        return response.json();
      })
      .then(surveys => {
        console.log(surveys);
        this.setState({ surveys });
      })
      .catch(e => console.error('error GET /surveys', e))
  }


  render() {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);

    return (
      <ExpansionList className={cn({ 'md-cell md-cell--12': false })}>
        {this.state.surveys.map(s =>
          <ExpansionPanel key={s.id} label={s.name ? s.name : "no-name"} onCancel={() => console.log('cancel')} >
            <h4>public urls: </h4>
            {getSurveyPublicUrls(s.id).map(u => <p key={s.id}> <a href={u}>{u}</a>  </p>)}
          </ExpansionPanel>
        )}
      </ExpansionList>
    );
  }
}


class SimpleModal extends PureComponent {
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
        <SurveyList />
      </Fragment>
    );
  }
}


export { SurveyPage }