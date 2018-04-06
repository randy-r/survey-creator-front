// @flow
import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button, Chip, Checkbox
} from 'react-md';
import { createAuthorizedRequest } from '../../utils';


const InputFieldLikeText = ({ text }) => (
  <div className="md-text-field-container md-text-field-container--disabled md-text-field-container--input"
    style={{ display: 'flex', alignItems: 'center', paddingLeft: '1%', paddingRight: '1%' }}
  >
    {text}
  </div>
);


class CreateTrickItemForm extends Component {
  state = ({
    value: '',
    blocks: [],
    crtInputValue: '',
    crtIsCorrect: false,
    answersPool: [],
    crtCorrectInputValue: '',
    answersPoolCorrect: [], // the order is important, there is only this correct answer sequence
  })

  validateBlocks = blocks => {
    if (blocks.filter(b => b.type === 'blank').length < 1) {
      alert('Must have at least one blank block');
      return false;
    }

    if (blocks.filter(b => b.type === 'text').length < 1) {
      alert('Must have at least one text block');
      return false;
    }

    return true;
  }

  validate = (blocks, answersPool, answersPoolCorrect) => {
    if (!this.validateBlocks(blocks)) {
      return false;
    }
    if (blocks.filter(b => b.type === 'blank').length !== answersPoolCorrect.length) {
      alert('Must have the same number of blanks as correct answers');
      return false;
    }
    return true;
  }

  create2 = () => {
    const { blocks, answersPool, answersPoolCorrect } = this.state;
    if (!this.validate(blocks, answersPool, answersPoolCorrect)) return;
    const payload = {
      blocks,
      answersPool,
      correctAnswersPool: answersPoolCorrect,
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

  addText = () => {
    const { value, blocks } = this.state;
    if (!value) return;
    let newBlocks;
    // merge the new value to the previous one if previous is of type 'text'
    const lastBlock = blocks[blocks.length - 1];
    if (blocks.length > 0 && lastBlock.type === 'text') {
      newBlocks = blocks.slice();
      lastBlock.text = `${lastBlock.text}${value}`;
    } else {
      newBlocks = blocks.concat({ text: value, type: 'text' });
    }
    this.setState({
      blocks: newBlocks,
      value: ''
    });
  }

  addBlank = () => {
    const { blocks } = this.state;
    this.setState({
      blocks: blocks.concat({ text: null, type: 'blank' }),
    });
  }

  handleTextChange = value => this.setState({ value })

  handleEnter = e => {
    if (e.keyCode === 13) {
      this.addText();
    }
  }

  addAnswer2 = () => {
    const { crtInputValue, answersPool } = this.state;

    this.setState({
      crtInputValue: '',
      answersPool: answersPool.concat([crtInputValue]),
    });
  }

  addAnswerCorrect = () => {
    const { crtCorrectInputValue, answersPoolCorrect } = this.state;

    this.setState({
      crtCorrectInputValue: '',
      answersPoolCorrect: answersPoolCorrect.concat([crtCorrectInputValue]),
    });
  }

  render() {
    return (
      <div className="md-grid">
        {this.state.blocks.map((b, i) => {
          if (b.type === 'text') {
            return <InputFieldLikeText key={i} text={b.text} />
          }

          return (
            <TextField
              disabled key={i}
              placeholder="BLANK"
              className="md-cell" id={`blank-${i}`}
              resize={{ max: 340 }}
            />);
        }
        )}
        <TextField
          id="trick-item-block-text"
          onChange={this.handleTextChange}
          value={this.state.value}
          className="md-cell md-cell--12"
          placeholder="Text Section"
          onKeyUp={this.handleEnter}
        />
        <div className="md-cell md-cell--12 md-cell--center" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button className="md-cell md-cell--3" onClick={this.addText} flat secondary iconChildren="add_circle_outline">Add Text</Button>
          <Button className="md-cell md-cell--3" onClick={this.addBlank} flat primary iconChildren="add_circle_outline">Add Blank</Button>
        </div>

        <h4>Fake answers </h4>
        <div className="md-cell md-cell--12" />

        {this.state.answersPool.map((badE, ii) => {
          return <InputFieldLikeText text={`${badE}`} />
        })}
        <TextField
          id={`trick-answer-$`}
          placeholder="Enter trick/fake word..."
          lineDirection="center"
          className="md-cell"
          value={this.state.crtInputValue}
          onChange={value => this.setState({ crtInputValue: value })}
          resize={{ max: 340 }}
        />
        <div className="md-cell md-cell--12" />


        <div className="md-cell md-cell--12 md-cell--center" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button className="md-cell md-cell--3" disabled={!this.state.crtInputValue} onClick={this.addAnswer2} flat secondary iconChildren="add_circle_outline">
            Add Fake Answer
          </Button>
        </div>

        <h4>Correct answers </h4>
        <div className="md-cell md-cell--12" />
        {this.state.answersPoolCorrect.map((correctE, jj) => {
          return <InputFieldLikeText text={`${correctE}`} />
        })}

        <TextField
          id={`trick-answer-$$$`}
          placeholder="Enter correct word..."
          lineDirection="center"
          className="md-cell"
          value={this.state.crtCorrectInputValue}
          onChange={value => this.setState({ crtCorrectInputValue: value })}
          resize={{ max: 340 }}
        />
        <div className="md-cell md-cell--12" />


        <div className="md-cell md-cell--12 md-cell--center" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button className="md-cell md-cell--3" disabled={!this.state.crtCorrectInputValue} onClick={this.addAnswerCorrect} flat secondary iconChildren="add_circle_outline">
            Add Correct Answer
          </Button>
        </div>

        <div className="md-cell md-cell--12" />
        <Button flat primary onClick={this.create2}>Confirm</Button>
      </div>
    );
  }
}


export default CreateTrickItemForm;

