import React, { PureComponent, Component, Fragment } from 'react';
import {
  TextField
} from 'react-md';
import cn from 'classnames';
import { createAuthorizedRequest } from '../../utils';

const convertToMilliseconds = (minutes, hours, days) => {
  return minutes * 60000 + hours * 60 * 60000 + days * 24 * 60 * 60000;
};

class FollowUpIntervalFields extends Component {
  hours = 1
  days = 1
  minutes = 1

  handleChange = () => {
    const { onChange } = this.props;
    let milliseconds = convertToMilliseconds(this.minutes, this.hours, this.days);
    onChange(milliseconds);
  }

  pattern = '^d+(\.|\,)\d{2}'

  render() {
    return (
      <Fragment>
        <TextField
          id="days"
          label="Days"
          type="number"
          defaultValue={this.days}
          step={1}
          min={0}
          pattern={this.pattern}
          className="md-cell md-cell--2 md-cell--1-phone"
          required
          onChange={v => { this.days = v; this.handleChange(); }}
        />
        <TextField
          id="hours"
          label="Hours"
          type="number"
          defaultValue={this.hours}
          step={1}
          min={0}
          max={24}
          pattern={this.pattern}
          className="md-cell md-cell--2 md-cell--1-phone"
          required
          onChange={v => { this.hours = v; this.handleChange(); }}
        />
        <TextField
          id="minutes"
          label="Minutes"
          type="number"
          defaultValue={this.minutes}
          step={1}
          min={0}
          pattern={this.pattern}
          className="md-cell md-cell--2 md-cell--1-phone"
          required
          onChange={v => { this.minutes = v; this.handleChange() }}
        />
      </Fragment>
    );
  }
}


export default FollowUpIntervalFields;