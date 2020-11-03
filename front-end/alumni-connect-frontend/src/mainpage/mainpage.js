import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import Profile from '../profile/profile';
import PostList from '../post/post';

function MainPage() {
    let history = useHistory();
    const doLogout = async() => {

      UserStore.username = '';
      UserStore.isLoggedIn = false;
      UserStore.loading = false;
      history.goBack();
    }
    
    return (
        <div>
            <SubmitButton 
              text={'Log out'}
              disabled={false}
              onClick={() => doLogout()}
            />
            Log In success
            <div>hi {UserStore.username}</div>
            <Router>
        
            <div className='account'>
            {!!!UserStore.isLoggedIn ? 
              <div>
                <Link to="/profile">Your Profile</Link>
                <Link to="/mainpage">Mainpage</Link>
              </div> : null}
            <Switch>
              <Route exact path = "/profile">
                <Profile />
              </Route>
              <Route exact path = "/mainpage">
                <PostList />
              </Route>
            </Switch>
            </div>
          </Router>
        </div>
    );

}

export default MainPage;
