import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button
} from 'react-md';
import { createAuthorizedRequest } from '../../utils';


class CreateSurveyForm extends Component {

  state = {
    name: "",
    availableQuestionnares: [],
    availableFakeQuestionnares: [],
    selectedQuestionnares: [],
  }

  inProgress = false

  componentDidMount() {
    let subResource;
    subResource = 'questionnaires';
    fetch(createAuthorizedRequest(`/api/${subResource}`))
      .then(response => {
        return response.json();
      })
      .then(all => {
        console.log(all);
        this.setState({ availableQuestionnares: all });
      })
      .catch(e => console.error(`error GET ${subResource}`, e))


    subResource = 'fakequestionnaires';
    fetch(createAuthorizedRequest(`/api/${subResource}`))
      .then(response => {
        return response.json();
      })
      .then(all => {
        console.log(all);
        this.setState({ availableFakeQuestionnares: all });
      })
      .catch(e => console.error(`error GET ${subResource}`, e))
  }

  handleNameChange = newVal => this.setState({ name: newVal })

  addQuestionnare = q => {
    if (this.inProgress) return;
    this.inProgress = true;

    const newSQ = this.state.selectedQuestionnares.slice();

    if (q.type === 'valid') {
      const newAQ = this.state.availableQuestionnares.filter(el => el.id !== q.id);
      newSQ.push(q);
      this.setState({
        availableQuestionnares: newAQ,
        selectedQuestionnares: newSQ
      }, () => this.inProgress = false);
    } else {
      const newFakeAQ = this.state.availableFakeQuestionnares.filter(el => el.id !== q.id);
      newSQ.push(q);
      this.setState({
        availableFakeQuestionnares: newFakeAQ,
        selectedQuestionnares: newSQ
      }, () => this.inProgress = false);
    }
  }


  removeQuestionnare = q => {
    if (this.inProgress) return;
    this.inProgress = true;

    const newSQ = this.state.selectedQuestionnares.filter(el => el.id !== q.id);

    if (q.type === 'valid') {
      const newValidAQ = this.state.availableQuestionnares.slice();
      newValidAQ.push(q);
      this.setState({
        availableQuestionnares: newValidAQ,
        selectedQuestionnares: newSQ
      }, () => this.inProgress = false);
    } else {
      const newFakeAQ = this.state.availableFakeQuestionnares.slice();
      newFakeAQ.push(q);
      this.setState({
        availableFakeQuestionnares: newFakeAQ,
        selectedQuestionnares: newSQ
      }, () => this.inProgress = false);
    }
  }

  validate = () => {
    // requirements say only 2 FQs are allowed and the must be adjecent
    const { selectedQuestionnares } = this.state;
    if (selectedQuestionnares.length < 1) return false;
    let numFakes = 0;
    let prevWasFake = false;
    for (let i = 0; i < selectedQuestionnares.length; ++i) {
      const q = selectedQuestionnares[i];
      if (q.type === 'fake') {
        ++numFakes;
        if (numFakes > 2) return false;
        prevWasFake = true;
      }
      else if (prevWasFake && numFakes < 2) { //[..., fake, valid, ...] but not yet 2 fakes => adjecenty break
        return false;
      }
    }
    if (numFakes < 2) {
      return false;
    }
    return true;
  }

  createSurvey = () => {
    if (!this.validate()) {
      alert('You must select at least 2 fake questionares! The must be placed adjecent to each other.');
      return;
    }

    const payload = {
      name: this.state.name,
      adminId: "xyz",
      questionaresIDsAndTypes: this.state.selectedQuestionnares
        .map(q => ({ id: q.id, type: q.type }))
    };

    fetch(createAuthorizedRequest("/api/surveys", {
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
    const fakeColor = '#FFD8CD';
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
            <ListItem style={q.type === 'fake' ? { background: fakeColor } : undefined} key={q.id} primaryText={q.name} onClick={() => this.removeQuestionnare(q)} />
          ))}
        </List>
        <List className="md-cell md-cell--6 md-paper md-paper--1" >
          <Subheader primary primaryText="All fake questionares:" />
          {this.state.availableFakeQuestionnares.map(q => (
            <ListItem style={{ background: fakeColor }} key={q.id} primaryText={q.name} onClick={() => this.addQuestionnare(q)} />
          ))}

        </List>

        <Button flat secondary onClick={this.props.onCancelCallback}>Cancel</Button>
        <Button flat primary onClick={this.createSurvey}>Confirm</Button>
      </div>
    );
  }
}

export { CreateSurveyForm }