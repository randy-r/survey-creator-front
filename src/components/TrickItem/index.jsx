import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer, TextField, ExpansionPanel,
  ExpansionList
} from 'react-md';
import cn from 'classnames';

import CreateTrickItemForm from './CreateTrickItemForm';
import { List } from '../List';
import CreateFormModalTrigger from '../CreateFormModalTrigger';


class TrickItemsPage extends Component {

  buildTitle = el => {
    return el.blocks
      .map(b => b.type === 'text' ? b.text : '_')
      .reduce((acc, crt) => `${acc} ${crt} `);
  }

  render() {
    return (
      <Fragment>
        <CreateFormModalTrigger
          title="Create New Trick Item"
          renderContent={hide => <CreateTrickItemForm resource="trickitems" textFieldLabel="Text" onSaveCallback={hide} onCancelCallback={hide} />} />
        <div style={{ height: '1vh' }} />
        <List titleRender={this.buildTitle} resource="trickitems" detailsDataExists />
      </Fragment>
    );
  }
}

export { TrickItemsPage };
