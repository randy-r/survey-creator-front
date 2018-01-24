import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button
} from 'react-md';


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
    fetch(`/api/${subResource}`)
      .then(response => {
        return response.json();
      })
      .then(all => {
        console.log(all);
        this.setState({ availableQuestionnares: all });
      })
      .catch(e => console.error(`error GET ${subResource}`, e))


    subResource = 'fakequestionnaires';
    fetch(`/api/${subResource}`)
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

  createSurvey = () => {
    const payload = {
      name: this.state.name,
      adminId: "xyz",
      questionaresIDsAndTypes: this.state.selectedQuestionnares
        .map(q => ({ id: q.id, type: q.type }))
    };

    fetch("/api/surveys", {
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