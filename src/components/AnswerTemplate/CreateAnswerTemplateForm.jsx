// @flow
import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button, Chip
} from 'react-md';
import { createAuthorizedRequest, getToken } from '../../utils';


class CreateAnswerTemplateForm extends Component {
  state = {
    newBulletText: '',
    bullets: []
  }


  add = () => {
    const { newBulletText, bullets } = this.state;
    // if (!newBulletText) return; allow bullets without text
    this.setState({
      bullets: bullets.concat([{ text: newBulletText }]),
      newBulletText: ''
    });
  }

  remove = bullet => {
    const { bullets } = this.state;
    this.setState({
      bullets: bullets.filter(b => b !== bullet)
    });
  }

  create = () => {
    const { bullets } = this.state;
    if (bullets.length < 2) {
      alert('Should have at least 2 answers');
      return;
    }

    const payload = {
      bullets,
    };

    fetch(createAuthorizedRequest(`/api/${this.props.resource}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
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

  handleFieldChange = newVal => this.setState({ newBulletText: newVal })

  handleEnter = e => {
    if (e.keyCode === 13) {
      this.add();
    }
  }

  render() {
    // TODO: better allignment
    return (
      <div className="md-grid">
        <div className="md-cell md-cell--12">
          {this.state.bullets.map((b, i) => <Chip key={i} label={`${i + 1}) ${b.text}`} removable onClick={() => this.remove(b)} />)}
        </div>
        <TextField
          id="newBulletText"
          className="md-cell md-cell--6"
          label={this.props.textFieldLabel}
          value={this.state.newBulletText}
          onChange={this.handleFieldChange}
          onKeyUp={this.handleEnter}
        />
        <Button onClick={this.add} className="md-cell md-cell--6" icon secondary>add_circle_outline</Button>
        <div className="md-cell md-cell--12">
          <Button flat secondary onClick={this.props.onCancelCallback}>Cancel</Button>
          <Button flat primary onClick={this.create}>Confirm</Button>
        </div>
      </div>
    );
  }
}


export default CreateAnswerTemplateForm;

