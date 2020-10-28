import React from 'react';
import UserStore from '../stores/UserStore';

function MainPage() {

    
    return (
        <div>
            Log In success
            <div>hi {UserStore.username}</div>
        </div>
    );

}

export default MainPage;
