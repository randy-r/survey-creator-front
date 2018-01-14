import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer, TextField, ExpansionPanel,
  ExpansionList
} from 'react-md';
import cn from 'classnames';

import { List } from '../List';
import CreateFormModalTrigger from '../CreateFormModalTrigger';
import CreateAnswerTemplateForm from './CreateAnswerTemplateForm';


class AnswerTemplatesPage extends Component {

  render() {
    return (
      <Fragment>
        <CreateFormModalTrigger
          title="Create New Anwer Template"
          renderContent={hide => (
            <CreateAnswerTemplateForm
              resource="answerTemplates"
              textFieldLabel="Text"
              onSaveCallback={hide}
              onCancelCallback={hide}
            />
          )}
        />
        <div style={{ height: '1vh' }} />
        <List titleRender={el => el.bullets.map((b, i) => `(${i + 1})${b.text}`).reduce((acc, crt) => `${acc} ${crt}`)} resource="answerTemplates" />
      </Fragment>
    );
  }
}

export { AnswerTemplatesPage };
