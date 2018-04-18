import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button, SelectField
} from 'react-md';
import { createAuthorizedRequest, validateExistanceAndPrompt } from '../../utils';
import FollowUpSurveySelection from './FollowUpSurveySelection';
import FollowUpIntervalFields from './FollowUpIntervalFields';
import FollowUpForm from './FollowUpForm';


class CreateSurveyForm extends Component {

  state = {
    name: '',
    availableQuestionnares: [],
    availableFakeQuestionnares: [],
    selectedQuestionnares: [],
    instructions: '',
    postInstructions: '',
  }

  inProgress = false
  followUpSurveyId = null;
  followUpMilliseconds = null

  componentDidMount() {
    let subResource;
    subResource = 'questionnaires';
    fetch(createAuthorizedRequest(`/api/${subResource}`))
      .then(response => {
        return response.json();
      })
      .then(all => {
        this.setState({ availableQuestionnares: all });
      })
      .catch(e => console.error(`error GET ${subResource}`, e))


    subResource = 'fakequestionnaires';
    fetch(createAuthorizedRequest(`/api/${subResource}`))
      .then(response => {
        return response.json();
      })
      .then(all => {
        this.setState({ availableFakeQuestionnares: all });
      })
      .catch(e => console.error(`error GET ${subResource}`, e))
  }

  handleNameChange = newVal => this.setState({ name: newVal })
  handleInstructionsChange = newVal => this.setState({ instructions: newVal })
  handlePostInstructionsChange = newVal => this.setState({ postInstructions: newVal })

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

  validateStructure = () => {
    // requirements say only 0 or 2 FQs are allowed and the must be adjecent

    const { selectedQuestionnares } = this.state;
    if (selectedQuestionnares.filter(sq => sq.type === 'fake').length === 0) {
      return true;
    }
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
    const { name } = this.state;
    if (!validateExistanceAndPrompt(name, 'Name')) return;

    if (!this.validateStructure()) {
      alert('You must select 0 or 2 fake questionares! The must be placed adjecent to each other.');
      return;
    }

    const followUpInfo = this.followUpSurveyId ?
      {
        surveyId: this.followUpSurveyId,
        followUpMilliseconds: this.followUpMilliseconds
      }
      : null;

    const trimmed = this.state.instructions.trim();
    const posttrimmed = this.state.postInstructions.trim();
    const payload = {
      name: this.state.name,
      questionaresIDsAndTypes: this.state.selectedQuestionnares
        .map(q => ({ id: q.id, type: q.type })),
      followUpInfo,
      instructions: trimmed === '' ? null : trimmed,
      postInstructions: posttrimmed === '' ? null : posttrimmed,
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
      this.props.onSaveCallback();
    })
      .catch(error => {
        console.error('There has been a problem with your fetch operation: ', error.message);
      });
  }

  render() {
    const fakeColor = '#FFD8CD';
    return (
      <div className="md-grid">
        <TextField id="survey-name" label="Name" value={this.state.name} onChange={this.handleNameChange} required />
        <TextField
          id="autoresizing-2"
          label="Instructions (optional)"
          rows={2}
          value={this.state.instructions}
          onChange={this.handleInstructionsChange}
        />
        <TextField
          id="autoresizing-2"
          label="Post Instructions (optional)"
          rows={2}
          value={this.state.postInstructions}
          onChange={this.handlePostInstructionsChange}
        />
        <div className="md-cell md-cell--6">
          <List className="md-paper md-paper--1" >
            <Subheader primary primaryText="All questionares:" />
            {this.state.availableQuestionnares.map(q => (
              <ListItem key={q.id} primaryText={q.name} onClick={() => this.addQuestionnare(q)} />
            ))}

          </List>
          <List className="md-paper md-paper--1" >
            <Subheader primary primaryText="All fake questionares:" />
            {this.state.availableFakeQuestionnares.map(q => (
              <ListItem style={{ background: fakeColor }} key={q.id} primaryText={q.name} onClick={() => this.addQuestionnare(q)} />
            ))}

          </List>
        </div>

        <div className="md-cell md-cell--6">
          <List className="md-paper md-paper--1">
            <Subheader primary primaryText="Selected:" />
            {this.state.selectedQuestionnares.map(q => (
              <ListItem style={q.type === 'fake' ? { background: fakeColor } : undefined} key={q.id} primaryText={q.name} onClick={() => this.removeQuestionnare(q)} />
            ))}
          </List>
        </div>

        <FollowUpForm onSurveySelect={id => this.followUpSurveyId = id} onMilisecondsChange={ms => this.followUpMilliseconds = ms} />

        <div className="md-cell md-cell--12">
          <Button flat secondary onClick={this.props.onCancelCallback}>Cancel</Button>
          <Button flat primary onClick={this.createSurvey}>Confirm</Button>
        </div>
      </div>
    );
  }
}

export { CreateSurveyForm }