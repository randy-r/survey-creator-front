import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button
} from 'react-md';
import { createAuthorizedRequest, validateExistanceAndPrompt } from '../../utils';

class CreateQuestionnaireForm extends Component {

  // resource = 'questionnaires'
  // subResource = 'items'

  state = {
    name: '',
    instructions: '',
    postInstructions: '',
    available: [],
    selected: []
  }

  inProgress = false

  componentDidMount() {
    const { subResource } = this.props;
    fetch(createAuthorizedRequest(`/api/${subResource}`))
      .then(response => {
        return response.json();
      })
      .then(all => {
        this.setState({ available: all });
      })
      .catch(e => console.error(`error GET ${subResource}`, e))
  }

  handleNameChange = newVal => this.setState({ name: newVal })
  handleInstructionsChange = newVal => this.setState({ instructions: newVal })
  handlePostInstructionsChange = newVal => this.setState({ postInstructions: newVal })

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

  validateItems = () => {
    const imageItemsCount = this.state.selected.filter(el => !!el.imgUrl).length;
    const normalItemsCount = this.state.selected.length - imageItemsCount;
    const cond = (imageItemsCount > 1) || ((normalItemsCount > 0) && imageItemsCount > 0);
    if (cond) {
      alert('An image item must be the one and only item in a survey!');
      this.inProgress = false;
      return false;;
    }
    return true;
  }

  create = () => {
    const { name } = this.state;
    if (!validateExistanceAndPrompt(name, 'Name')) return;
    if (!this.validateItems()) return;

    const trimmed = this.state.instructions.trim();
    const posttrimmed = this.state.postInstructions.trim();
    const payload = {
      name: this.state.name,
      [`${this.props.subResource}Ids`]: this.state.selected.map(el => el.id),
      type: this.props.questionnaireType,
      instructions: trimmed === '' ? null : trimmed,
      postInstructions: posttrimmed === '' ? null : posttrimmed,
    };

    fetch(createAuthorizedRequest(`/api/${this.props.resource}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(payload)
    })).then(response => {
      return response.json();
    }).then(json => {
      this.props.onSaveCallback();
    })
      .catch(error => {
        console.error('There has been a problem with your fetch operation: ', error.message);
      });
  }

  render() {
    const { questionnaireType } = this.props;
    let displayItem;
    if (questionnaireType === 'valid') {
      displayItem = item => item.text;
    } else {
      displayItem = item => item
        .blocks
        .map(b => b.type === 'text' ? b.text : '_')
        .reduce((acc, crt) => `${acc} ${crt} `);
    }
    return (
      <div className="md-grid">
        <TextField id="survey-name" label="Name" value={this.state.name} onChange={this.handleNameChange} />
        <TextField
          id="autoresizing-2"
          label="Instructions (optional)"
          rows={2}
          value={this.state.instructions}
          onChange={this.handleInstructionsChange}
        />
        <TextField
          id="autoresizing-3"
          label="Post Instructions (optional)"
          rows={2}
          value={this.state.postInstructions}
          onChange={this.handlePostInstructionsChange}
        />
        <List className="md-cell md-cell--6 md-paper md-paper--1" >
          <Subheader primary primaryText={`All ${this.props.subResource}:`} />
          {this.state.available.map(el => (
            <ListItem key={el.id} primaryText={displayItem(el)} onClick={() => this.add(el)} />
          ))}

        </List>
        <List className="md-cell md-cell--6 md-paper md-paper--1">
          <Subheader primary primaryText="Selected:" />
          {this.state.selected.map(el => (
            <ListItem key={el.id} primaryText={displayItem(el)} onClick={() => this.remove(el)} />
          ))}
        </List>
        <Button flat secondary onClick={this.props.onCancelCallback}>Cancel</Button>
        <Button flat primary onClick={this.create}>Confirm</Button>
      </div>
    );
  }
}

export { CreateQuestionnaireForm }