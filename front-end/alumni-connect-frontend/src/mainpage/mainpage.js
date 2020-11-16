import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import Profile from '../profile/profile';
import PostList from '../post/post';
import {Button} from 'react-bootstrap'
import './mainpage.css'
import Personal from '../personal/personal';

function MainPage() {
    let history = useHistory();
    const doLogout = async() => {

      UserStore.username = '';
      UserStore.isLoggedIn = false;
      UserStore.loading = false;
      UserStore.setDataFromSessionStorage();
      history.replace("/");
      // history.goBack();
    }
    
    return (
        <div>
            <div className='nav'> 
              <div className ='brand'>Alumni Connect</div>
              <div className="logout">
                <Button 
                  className='logoutBtn'
                  disabled={false}
                  onClick={() => doLogout()}
                >Logout</Button>
              </div>
            </div>
            <div className='content'>
            <div className='titleName'>hi {UserStore.username}</div>
            <Router>
        
            <div className='tag'>
              <div className='tagBtn'>
                <Link to="/mainpage/profile" className='linkBtn'>Your Profile</Link>
                <Link to="/mainpage" className='linkBtn'>Mainpage</Link>
              </div>
            <Switch>
              <Route path = "/mainpage/profile">
                <Profile />
              </Route>
              <Route exact path = "/mainpage">
                <PostList />
              </Route>
              <Route path = "/mainpage/personal/:name" component={Personal}>
              </Route>
            </Switch>
            </div>
          </Router>
          </div>
        </div>
    );

}

export default MainPage;
