import React, { Component } from 'react';
import { NavigationDrawer, Button, FontIcon } from 'react-md';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount() {
    fetch('/api/foo')
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then(foos => console.log('Got foos: ', foos));
  }

  render() {
    return (
      <NavigationDrawer
        drawerTitle="react-md with CRA"
        toolbarTitle="Welcome to react-md"
      >
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
        <i className="material-icons">done</i>
        <Button raised primary iconEl={<FontIcon>done</FontIcon>} >Spock</Button>
        <Button raised secondary iconEl={<FontIcon>done</FontIcon>} >Spock</Button>
        <Button flat secondary iconEl={<FontIcon>done</FontIcon>} >Spock</Button>

        <h4 className="md-cell md-cell--12">Font icons from Material Icons</h4>
        <FontIcon>home</FontIcon>
        <FontIcon>favorite</FontIcon>
        <h4 className="md-cell md-cell--12">Font icons from FontAwesome</h4>
        <FontIcon iconClassName="fa fa-star-o" />
        <FontIcon iconClassName="fa fa-book" />
        {/* SVGIcons element can be used after the setup : https://react-md.mlaursen.com/components/svg-icons */}
      </NavigationDrawer>
    );
  }
}

export default App;
