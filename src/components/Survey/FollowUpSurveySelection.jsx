import React, { PureComponent, Component, Fragment } from 'react';
import {
  SelectField
} from 'react-md';
import cn from 'classnames';
import { createAuthorizedRequest } from '../../utils';


class FollowUpSurveySelection extends Component {
  state = { all: [], selectedValue: '' }

  componentDidMount() {
    const { resource } = this.props;
    fetch(createAuthorizedRequest(`/api/surveys`))
      .then(response => {
        return response.json();
      })
      .then(all => {
        this.setState({ all });
      })
      .catch(e => console.error(`error GET ${resource}`, e))
  }

  createMenuItems = () => {
    const { all } = this.state;
    const menuItems = all.map(s => ({ label: s.name, value: s.id, }));

    menuItems.unshift({ label: '-', value: '', });
    return menuItems;

  }

  handleChange = (value, index) => {
    const { onChange } = this.props;
    this.setState({ selectedValue: value }, () => {
      const newValue = value || null; // convert undefined and '' to null
      onChange(newValue);
    });
  }

  render() {
    return (
      <SelectField
        id="select-field-3"
        label="Follow Up Survey"
        placeholder="Survey"
        className="md-cell"
        menuItems={this.createMenuItems()}
        onChange={this.handleChange}
        simplifiedMenu={true}
        value={this.state.selectedValue}
      />
    );
  }
}


export default FollowUpSurveySelection;