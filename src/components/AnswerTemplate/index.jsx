import React, { Component, Fragment } from 'react';
import {
  Chip, List, ListItem
} from 'react-md';
import cn from 'classnames';

import CreateFormModalTrigger from '../CreateFormModalTrigger';
import CreateAnswerTemplateForm from './CreateAnswerTemplateForm';
import { createAuthorizedRequest } from '../../utils';


class AnswerTemplatesList extends Component {

  state = { all: [] }

  componentDidMount() {
    const resource = "answerTemplates";
    fetch(createAuthorizedRequest(`/api/${resource}`))
      .then(response => {
        return response.json();
      })
      .then(all => {
        console.log(all);
        this.setState({ all });
      })
      .catch(e => console.error(`error GET ${resource}`, e))
  }


  render() {
    const { detailsDataExists, resource, titleRender } = this.props;
    return (
      <List className={cn({ 'md-cell md-cell--12': false })}>
        {this.state.all.map(s =>
          <ListItem key={s.id}
            primaryText={s.bullets.map((b, i) => <Chip key={i} label={`${b.text}`} />)}
          />
        )}
      </List>
    );
  }
}

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
        <AnswerTemplatesList />
      </Fragment>
    );
  }
}

export { AnswerTemplatesPage };
