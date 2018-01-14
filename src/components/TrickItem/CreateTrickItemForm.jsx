// @flow
import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField, List, ListItem, Subheader, Button, Chip, Checkbox
} from 'react-md';


const InputFieldLikeText = ({ text }) => (
  <div className="md-text-field-container md-text-field-container--disabled md-text-field-container--input"
  style={{ display: 'flex', alignItems: 'center', paddingLeft: '1%', paddingRight: '1%' }}
  >
    {text}
  </div>
);


class CreateTrickItemForm extends Component {
  state = ({
    blocks: [],
    value: '',
    trickAnswers: [],
    crtTrickAnswer: {
      values: []
    },
    correctTrickAnswerIndex: 0
  })
  
  create = () => {
    const { blocks, correctTrickAnswerIndex, trickAnswers} = this.state;
    const payload = {
      blocks,
      correctTrickAnswerIndex,
      trickAnswers
    };
  
    fetch(`/${this.props.resource}`, {
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

  addAnswer = () => {
    // const valuesCopy = ['dsa', 'zzz']
    const valuesCopy = this.state.crtTrickAnswer.values.splice(0);
    const trickAnswersCopy = this.state.trickAnswers.splice(0);
    trickAnswersCopy.push({ values: valuesCopy });
    this.setState({
      trickAnswers: trickAnswersCopy,
      // crtTrickAnswer: { values: this.state.blocks.filter(b => b.text == 'blank').map(b => '') }
    })
  }

  handleTrickValueChange = (value, i) => {
    const copy = this.state.crtTrickAnswer.values.splice(0);
    copy[i] = value;

    this.setState({ crtTrickAnswer: { values: copy } })
  }

  handleCheck = index => {
    console.log('index ', index);
    this.setState({
      correctTrickAnswerIndex: index
    })
  }

  generateTrickAnswersJsx = () => {
    const { trickAnswers } = this.state;
    const answers = [];
    return trickAnswers.map((a, j) =>
      <Fragment>
        <InputFieldLikeText text={`${j + 1})`} />
        {a.values.map((v, i) => (
          // show each field
          <InputFieldLikeText
            key={`${j}-${i}`}
            text={`${v},`}
          />

        ))}
        <Checkbox
          id={`custom-checkbox-icon-${j}`}
          name={`using-custom-icons-${j}`}
          label={`correct-answer`}
          checked={this.state.correctTrickAnswerIndex === j}
          onChange={() => this.handleCheck(j)}
          // onClick={e => e.preventDefault()}
        />
        <div className="md-cell md-cell--12" />
      </Fragment>
    );

  }

  generateTrickAnswerInput = () => {
    const { blocks, crtTrickAnswer } = this.state;

    return blocks.filter(b => b.type !== 'text').map((_, i) => (
      <TextField
        key={`$${i}`}
        id={`trick-answer-${i}`}
        placeholder="Enter word..."
        lineDirection="center"
        className="md-cell"
        value={crtTrickAnswer.values[i] ? crtTrickAnswer.values[i] : ''}
        onChange={value => this.handleTrickValueChange(value, i)}
        resize={{ max: 340 }}
      />
    ));
  }


  render() {
    const { value, blocks } = this.state;
    console.log('blocks ', blocks)
    return (
      <div className="md-grid">
        {blocks.map((b, i) => {
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
          value={value}
          className="md-cell md-cell--12"
          placeholder="Text Section"
          onKeyUp={this.handleEnter}
          disabled={this.state.trickAnswers.length !== 0}
        />
        <div className="md-cell md-cell--12 md-cell--center" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button className="md-cell md-cell--3" disabled={this.state.trickAnswers.length !== 0} onClick={this.addText} flat secondary iconChildren="add_circle_outline">Add Text</Button>
          <Button className="md-cell md-cell--3" disabled={this.state.trickAnswers.length !== 0} onClick={this.addBlank} flat primary iconChildren="add_circle_outline">Add Blank</Button>
        </div>
        {/* <div className="md-grid"> */}
        <h4> Possible answers </h4>
        <div className="md-cell md-cell--12" />
        
        {this.generateTrickAnswersJsx()}
        <div className="md-cell md-cell--12" />
        {this.generateTrickAnswerInput()}

        {/* </div> */}

        <div className="md-cell md-cell--12 md-cell--center" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button className="md-cell md-cell--3" disabled={this.state.blocks.length === 0} onClick={this.addAnswer} flat secondary iconChildren="add_circle_outline">Add Answer</Button>
        </div>
        <Button flat primary onClick={this.create}>Confirm</Button>
      </div>
    );
  }
}


export default CreateTrickItemForm;

