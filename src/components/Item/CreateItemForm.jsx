// @flow
import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button, Chip
} from 'react-md';
import { createAuthorizedRequest, validateExistanceAndPrompt } from '../../utils';


// TODO find a way to extract the common functionality of CreateForm* but also keep in mind the perticular API calls, for example the item POST
class CreateItemForm extends Component {
  state = {
    fieldValue: '',
    available: [],
    selected: [],
    imgUrl: ''
  }

  inProgress = false

  componentDidMount() {
    const { subResource } = this.props;
    fetch(createAuthorizedRequest(`/api/${subResource}`))
      .then(response => {
        return response.json();
      })
      .then(all => {
        console.log(all);
        this.setState({ available: all });
      })
      .catch(e => console.error(`error GET ${subResource}`, e))
  }

  handleFieldChange = newVal => this.setState({ fieldValue: newVal })

  handleImageUrlChange = newVal => this.setState({ imgUrl: newVal })

  add = x => {
    if (this.inProgress) return;
    // only one anwer template is allowed per item
    if (this.state.selected.length > 0) return;
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
    const { fieldValue } = this.state;
    if (!validateExistanceAndPrompt(fieldValue, 'Text')) return;

    if (this.state.selected.length < 1) {
      alert('Must select at least 1 answer template');
      return;
    }

    let answerTemplate = this.state.selected[0];
    delete answerTemplate.adminId;
    delete answerTemplate.id;

    const payload = {
      text: fieldValue,
      answerTemplate,
      imgUrl: this.state.imgUrl
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
        <TextField id="fieldValue" label={this.props.textFieldLabel} value={this.state.fieldValue} onChange={this.handleFieldChange} />
        <TextField id="imgUrl" label="Image Url (Optional)" value={this.state.imgUrl} onChange={this.handleImageUrlChange} />
        <p className="md-cell md-cell--12"> Only one anwer template can be selected.</p>
        <List className="md-cell md-cell--6 md-paper md-paper--1" >
          <Subheader primary primaryText={`All ${this.props.subResource}:`} />
          {this.state.available.map(el => (
            <ListItem primaryText="" key={el.id} onClick={() => this.add(el)}
            // component={
            //   () => { return el.bullets.map((b, i) => <Chip key={i} label={b.text} />) }
            // }
            >
              {el.bullets.map((b, i) => <Chip key={i} label={`${i + 1}) ${b.text}`} />)}
            </ListItem>
          ))}

        </List>
        <List className="md-cell md-cell--6 md-paper md-paper--1">
          <Subheader primary primaryText="Selected:" />
          {this.state.selected.map(el => (
            <ListItem primaryText="" key={el.id} onClick={() => this.remove(el)} >
              {el.bullets.map((b, i) => <Chip key={i} label={`${i + 1}) ${b.text}`} />)}
            </ListItem>
          ))}
        </List>
        <div className="md-cell md-cell--12">
          <Button flat secondary onClick={this.props.onCancelCallback}>Cancel</Button>
          <Button flat primary onClick={this.create}>Confirm</Button>
        </div>
      </div>
    );
  }
}


export { CreateItemForm }
