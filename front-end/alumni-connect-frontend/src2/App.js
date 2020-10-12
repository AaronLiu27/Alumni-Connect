import React from 'react';
import { observer } from 'mobx-react';
import UserStore from './stores/UserStore';
import LoginForm from './loginForm';
import SubmitButton from './submitButton';
import RegisterForm from './register';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import './App.css';

class App extends React.Component {

  async componentDidMount() {

    try {

      let res = await fetch('/isLoggedIn', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
      } else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      }

    } catch (e) {
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
    }


  }

  async doLogout() {

    try {

      let res = await fetch('/logout', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.username = '';
        UserStore.isLoggedIn = false;
      }

    } catch (e) {
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
      console.log(e);
    }

  }

  render() {

    if (UserStore.loading) {
      return (
        <div className="app">
          <div className='container'>
            Loading, please wait...
          </div>
        </div>
      );
    } else {

      if (UserStore.isLoggedIn) {
        return (
          <div className="app">
            <div className='container'>
              Welcome {UserStore.username}

              <SubmitButton 
                text={'Log out'}
                disabled={false}
                onClick={() => this.doLogout()}
              />

            </div>
          </div>
        );
      }

      return (
        <div className="app">
          <div className='container'>
            <Router>
              <Switch>
                <Route exact path = "/">
                  <LoginForm />
                </Route>
                <Route exact path = "/register">
                  <RegisterForm />
                </Route>
              </Switch>

              <div>
                <Link to="/">Login</Link>
                <Link to="/register">Register</Link>
              </div>
            </Router>

          
          </div>
        </div>
      );
    }
  }

}

export default observer(App);
