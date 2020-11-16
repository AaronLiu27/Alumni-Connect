import {extendObservable, action} from 'mobx';
import { runInAction } from 'mobx';


class UserStore {
    constructor() {
        extendObservable(this, {

            loading: false,
            isLoggedIn: false,
            username: '',
            token:'',
            id:''
        })
    }
    getDataFromSessionStorage = () => {
        let logIn, usrname, tk, pre_id;
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        const username = sessionStorage.getItem("username");
        const token = sessionStorage.getItem("token");
        const id = sessionStorage.getItem("id");
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
        if(!id) {
            pre_id = '';
        } else {
            pre_id = JSON.parse(id);
        }
        runInAction(() => {
            this.isLoggedIn = logIn;
            this.username = usrname;
            this.token = tk;
            this.id = pre_id;
        });
    }

    setDataFromSessionStorage = () => {
        sessionStorage.setItem("isLoggedIn",JSON.stringify(this.isLoggedIn));
        sessionStorage.setItem("username",JSON.stringify(this.username));
        sessionStorage.setItem("token",JSON.stringify(this.token));
        sessionStorage.setItem("id",JSON.stringify(this.id));
    };
}

export default new UserStore();