import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button
} from 'react-md';

class CreateSurveyForm extends Component {

  state = {
    name: "",
    availableQuestionnares: [],
    selectedQuestionnares: []
  }

  inProgress = false

  componentDidMount() {
    const subResource = 'questionnaires';
    fetch(`/${subResource}`)
      .then(response => {
        return response.json();
      })
      .then(all => {
        console.log(all);
        this.setState({ availableQuestionnares: all });
      })
      .catch(e => console.error(`error GET ${subResource}`, e))
  }

  handleNameChange = newVal => this.setState({ name: newVal })

  addQuestionnare = q => {
    if (this.inProgress) return;
    this.inProgress = true;

    const newAQ = this.state.availableQuestionnares.filter(el => el.id !== q.id);
    const newSQ = this.state.selectedQuestionnares.slice();
    newSQ.push(q);
    this.setState({
      availableQuestionnares: newAQ,
      selectedQuestionnares: newSQ
    }, () => this.inProgress = false);
  }


  removeQuestionnare = q => {
    if (this.inProgress) return;
    this.inProgress = true;

    const newSQ = this.state.selectedQuestionnares.filter(el => el.id !== q.id);
    const newAQ = this.state.availableQuestionnares.slice();
    newAQ.push(q);
    this.setState({
      availableQuestionnares: newAQ,
      selectedQuestionnares: newSQ
    }, () => this.inProgress = false);
  }

  createSurvey = () => {
    const payload = {
      name: this.state.name,
      adminId: "abc",
      questionaresIds: this.state.selectedQuestionnares.map(q => q.id)
    };
    
    fetch("/surveys", {
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
          <Subheader primary primaryText="All questionares:" />
          {this.state.availableQuestionnares.map(q => (
            <ListItem key={q.id} primaryText={q.name} onClick={() => this.addQuestionnare(q)} />
          ))}

        </List>
        <List className="md-cell md-cell--6 md-paper md-paper--1">
          <Subheader primary primaryText="Selected:" />
          {this.state.selectedQuestionnares.map(q => (
            <ListItem key={q.id} primaryText={q.name} onClick={() => this.removeQuestionnare(q)} />
          ))}
        </List>
        <Button flat secondary onClick={this.props.onCancelCallback}>Cancel</Button>
        <Button flat primary onClick={this.createSurvey}>Confirm</Button>
      </div>
    );
  }
}

export { CreateSurveyForm }