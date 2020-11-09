import {extendObservable} from 'mobx';


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
}

export default new UserStore();