import {extendObservable, action} from 'mobx';


class UserStore {
    constructor() {
        extendObservable(this, {

            loading: false,
            isLoggedIn: false,
            username: '',
            token:''

        })
    }
    getDataFromSessionStorage = () => {
        let logIn, usrname, tk;
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        const username = sessionStorage.getItem("username");
        const token = sessionStorage.getItem("token");
        if (!isLoggedIn) {
            logIn = false;
        } else {
            logIn = JSON.parse(isLoggedIn);
        }
        if (!username) {
            usrname = '';
        } else {
            usrname = JSON.parse(username);
        }
        if (!token) {
            tk = '';
        } else {
            tk = JSON.parse(token);
        }
        this.isLoggedIn = logIn;
        this.username = usrname;
        this.token = tk;
    }

    setDataFromSessionStorage = () => {
        sessionStorage.setItem("isLoggedIn",JSON.stringify(this.isLoggedIn));
        sessionStorage.setItem("username",JSON.stringify(this.username));
        sessionStorage.setItem("token",JSON.stringify(this.token));
    };
}

export default new UserStore();