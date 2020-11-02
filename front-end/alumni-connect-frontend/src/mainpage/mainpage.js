import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";

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
        </div>
    );

}

export default MainPage;
