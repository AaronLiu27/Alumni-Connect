import React, {useEffect} from 'react';
import { observer } from 'mobx-react';
import UserStore from './stores/UserStore';
import LoginForm from './login/loginForm';
import SubmitButton from './component/submitButton';
import RegisterForm from './register/register';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import './App.css';
import MainPage from './mainpage/mainpage';
import { runInAction } from 'mobx';

function App() {

  const checkLogin = async() => {
    try {
      let res = await fetch('/isLoggedIn', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      let result = await res.json();
      runInAction(() => {
        if (result && result.success) {
          UserStore.loading = false;
          UserStore.isLoggedIn = true;
          UserStore.username = result.username;
        } else {
          UserStore.loading = false;
          UserStore.isLoggedIn = false;
        }
      });

    } catch (e) {
      runInAction(() => {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      })
    }
  }


  useEffect(() => {checkLogin()}, []);

  if (UserStore.loading) {
    return (
      <div className="app">
        
          Loading, please wait...
      
      </div>
    );
  } else {

    return (
       <div className="app">
       
          <Router>
        
            <div className='account'>
            {UserStore.isLoggedIn==false && 
              <div>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </div>}
            <Switch>
              <Route exact path = "/login">
                <LoginForm />
              </Route>
              <Route exact path = "/register">
                <RegisterForm />
              </Route>
              <Route exact path = "/mainpage">
                <MainPage />
              </Route>
            </Switch>
            </div>
          </Router>

        
        
      </div>
    );
  }

}

export default observer(App);
