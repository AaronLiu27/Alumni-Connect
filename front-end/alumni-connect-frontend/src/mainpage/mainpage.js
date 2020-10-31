import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';

function MainPage() {
    const doLogout = async() => {

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
