import React, { PureComponent, Component, Fragment } from 'react';
import {
  SelectField
} from 'react-md';
import FollowUpSurveySelection from './FollowUpSurveySelection';
import FollowUpIntervalFields from './FollowUpIntervalFields';


class FollowUpForm extends Component {
  state = {}

  handleSurveyChange = id => {
    const { onSurveySelect } = this.props;
    this.setState({ showIntervals: !!id }, () => onSurveySelect(id))
  }

  render() {
    const { onMilisecondsChange } = this.props;
    const { showIntervals } = this.state;
    return (
      <Fragment>
        <div className="md-cell md-cell--6">
          <FollowUpSurveySelection onChange={this.handleSurveyChange} />
        </div>

        {showIntervals && (
          <div className="md-cell md-cell--6 md-grid">
            <FollowUpIntervalFields onChange={onMilisecondsChange} />
          </div>
        )}
      </Fragment>
    );
  }
}


export default FollowUpForm;