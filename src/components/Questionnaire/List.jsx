import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer, TextField, ExpansionPanel,
  ExpansionList
} from 'react-md';
import cn from 'classnames';


class List extends Component {

  state = { all: [] }

  componentDidMount() {
    const { resource } = this.props;
    fetch(`/${resource}`)
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
    return (
      <ExpansionList className={cn({ 'md-cell md-cell--12': false })}>
        {this.state.all.map(s =>
          <ExpansionPanel key={s.id} label={s.name ? s.name : "<no-name>"} onCancel={() => console.log('cancel')} >
            <p>---{s.id}</p>
          </ExpansionPanel>
        )}
      </ExpansionList>
    );
  }
}

export { List };
