import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer, TextField, ExpansionPanel,
  ExpansionList
} from 'react-md';
import cn from 'classnames';

import { CreateSurveyForm } from './CreateSurveyForm';

class SurveyList extends Component {

  state = { surveys: [] }

  componentDidMount() {
    fetch('/surveys')
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
    return (
      <ExpansionList className={cn({ 'md-cell md-cell--12': false })}>
        <ExpansionPanel label="SurveyNameA" onCancel={() => console.log('cancel')} >
          <p>dshabdshabdsabdsabhdsa sh suiaj ds as haushaj pfoij Ubdsa </p>
          <p>dshabdshabdsabdssd abhdsa sh suiaj ds as haushaj pfoij Ubdsa </p>
        </ExpansionPanel>
        <ExpansionPanel label="SurveyNameB" onCancel={() => console.log('cancel')} >
          <p>dshabdshabdsabdsabhdsa sh suiaj ds as haushaj pfoij Ubdsa </p>
          <p>dshabdshabdsabdssd abhdsa sh suiaj ds as haushaj pfoij Ubdsa </p>
        </ExpansionPanel>
        {this.state.surveys.map(s =>
          <ExpansionPanel key={s.id} label={s.name ? s.name : "no-name"} onCancel={() => console.log('cancel')} >
            <p>---{s.id}</p>
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
        <div style={{ height: '1vh' }} />
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
        <SurveyList />
      </Fragment>
    );
  }
}


export { SurveyPage }