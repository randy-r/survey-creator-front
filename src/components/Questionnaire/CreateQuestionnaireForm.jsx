import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button
} from 'react-md';

class CreateQuestionnaireForm extends Component {

  // resource = 'questionnaires'
  // subResource = 'items'

  state = {
    name: "",
    available: [],
    selected: []
  }

  inProgress = false

  componentDidMount() {
    const { subResource } = this.props;
    fetch(`/api/${subResource}`)
      .then(response => {
        return response.json();
      })
      .then(all => {
        console.log(all);
        this.setState({ available: all });
      })
      .catch(e => console.error(`error GET ${subResource}`, e))
  }

  handleNameChange = newVal => this.setState({ name: newVal })

  add = x => {
    if (this.inProgress) return;
    this.inProgress = true;

    const newAQ = this.state.available.filter(el => el.id !== x.id);
    const newSQ = this.state.selected.slice();
    newSQ.push(x);
    this.setState({
      available: newAQ,
      selected: newSQ
    }, () => this.inProgress = false);
  }

  remove = x => {
    if (this.inProgress) return;
    this.inProgress = true;

    const newSQ = this.state.selected.filter(el => el.id !== x.id);
    const newAQ = this.state.available.slice();
    newAQ.push(x);
    this.setState({
      available: newAQ,
      selected: newSQ
    }, () => this.inProgress = false);
  }

  create = () => {
    const payload = {
      name: this.state.name,
      adminId: "abc",
      [`${this.props.subResource}Ids`]: this.state.selected.map(el => el.id)
    };

    fetch(`/api/${this.props.resource}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(payload)
    }).then(response => {
      return response.json();
    }).then(json => {
      console.log(json);
      this.props.onSaveCallback();
    })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ', error.message);
      });
  }

  render() {
    return (
      <div className="md-grid">
        <TextField id="survey-name" label="Name" value={this.state.name} onChange={this.handleNameChange} />
        <List className="md-cell md-cell--6 md-paper md-paper--1" >
          <Subheader primary primaryText={`All ${this.props.subResource}:`} />
          {this.state.available.map(el => (
            <ListItem key={el.id} primaryText={el.text} onClick={() => this.add(el)} />
          ))}

        </List>
        <List className="md-cell md-cell--6 md-paper md-paper--1">
          <Subheader primary primaryText="Selected:" />
          {this.state.selected.map(el => (
            <ListItem key={el.id} primaryText={el.text} onClick={() => this.remove(el)} />
          ))}
        </List>
        <Button flat secondary onClick={this.props.onCancelCallback}>Cancel</Button>
        <Button flat primary onClick={this.create}>Confirm</Button>
      </div>
    );
  }
}

export { CreateQuestionnaireForm }