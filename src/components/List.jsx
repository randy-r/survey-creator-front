import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer, TextField, ExpansionPanel,
  ExpansionList
} from 'react-md';
import cn from 'classnames';
import JSONTree from 'react-json-tree'

import { createAuthorizedRequest } from '../utils';

const theme = {
  scheme: 'google',
  author: 'seth wright (http://sethawright.com)',
  base00: '#1d1f21',
  base01: '#282a2e',
  base02: '#373b41',
  base03: '#969896',
  base04: '#b4b7b4',
  base05: '#c5c8c6',
  base06: '#e0e0e0',
  base07: '#ffffff',
  base08: '#CC342B',
  base09: '#F96A38',
  base0A: '#FBA922',
  base0B: '#198844',
  base0C: '#3971ED',
  base0D: '#3971ED',
  base0E: '#A36AC7',
  base0F: '#3971ED'
};

class ExpansionPanelWithData extends Component {
  state = { entity: this.props.data }

  handleExpanded = expanded => {
    if (!expanded) return;
    if (expanded && this.state.entity) return;

    const { resource, id, contentUrl } = this.props;
    let url = contentUrl ? contentUrl : `/api/${resource}/${id}`;

    fetch(createAuthorizedRequest(url))
      .then(response => {
        return response.json();
      })
      .then(entity => {
        console.log(entity);
        this.setState({ entity });
      })
      .catch(e => console.error(`error GET ${resource} at ${id}`, e))
  }

  render() {
    const { id, resource, renderContent, ...panelProps } = this.props;
    const { entity } = this.state;
    const jsonData = entity || {};
    return (
      <ExpansionPanel footer={null}
        {...panelProps}
        onExpandToggle={this.handleExpanded}
      >
        {entity && renderContent && renderContent(entity)}
        <JSONTree data={jsonData} theme={theme} />
      </ExpansionPanel>
    );
  }

}


class List extends Component {

  state = { all: [] }

  componentDidMount() {
    const { resource } = this.props;
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
    const { detailsDataExists, resource, titleRender, renderContent, createContentUrl } = this.props;

    return (
      <ExpansionList className={cn({ 'md-cell md-cell--12': false })}>
        {this.state.all.map(s =>
          <ExpansionPanelWithData
            key={s.id}
            id={s.id}
            data={detailsDataExists ? s : null}
            resource={resource}
            renderContent={renderContent}
            contentUrl={createContentUrl ? createContentUrl(s.id): null}
            label={titleRender(s)}
            onCancel={() => console.log('cancel')}
          />
        )}
      </ExpansionList>
    );
  }
}

export { List };
