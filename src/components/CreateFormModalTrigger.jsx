import React, { PureComponent, Component, Fragment } from 'react';
import {
  Button, DialogContainer
} from 'react-md';


class CreateFormModalTrigger extends PureComponent {
  state = { visible: false };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    const { renderContent, title } = this.props;
    return (
      <Fragment>
        <Button onClick={this.show} floating secondary>add</Button>
        <DialogContainer
          id="simple-action-dialog"
          visible={visible}
          onHide={this.hide}
          title={this.props.title}
          width={"100vw"}
        >
          {renderContent(this.hide)}
        </DialogContainer>
      </Fragment>
    );
  }
}

export default CreateFormModalTrigger;
