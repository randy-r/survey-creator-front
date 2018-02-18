import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer, TextField, ExpansionPanel,
  ExpansionList
} from 'react-md';
import cn from 'classnames';

import { CreateItemForm } from './CreateItemForm';
import { List } from '../List';
import CreateFormModalTrigger from '../CreateFormModalTrigger';


class ItemsPage extends Component {

  render() {
    return (
      <Fragment>
        <CreateFormModalTrigger 
        title="Create New Item" 
        renderContent={hide => <CreateItemForm resource="items" subResource="answerTemplates" textFieldLabel="Text" onSaveCallback={hide} onCancelCallback={hide} />} />
        <div style={{ height: '1vh' }} />
        <List titleRender={el => el.text} resource="items" detailsDataExists />
      </Fragment>
    );
  }
}

export { ItemsPage };
