import React, { Component } from 'react';
import Route from 'react-router-dom/Route';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ImageUploader from './components/ImageUploader';
import Login from './components/Login';
import RouteWhenAuthenticated from './components/RouteWhenAuthenticated';
import NavigationMaster from './components/navigation/NavigationMaster';

import { storageKey, auth } from './firebase';
import styles from './styles';
import logo from './logo.svg';

import './App.css';

class App extends Component {
  state = {
    uid: null
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid);
        this.setState({uid: user.uid});
      } else {
        window.localStorage.removeItem(storageKey);
        this.setState({uid: null});
      }
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <NavigationMaster />
          <div style={styles.root}>
            <RouteWhenAuthenticated path="/" component={ImageUploader}/>
            <Route path="/login" component={Login} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
