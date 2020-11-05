import {extendObservable} from 'mobx';


class UserStore {
    constructor() {
        extendObservable(this, {

            loading: false,
            isLoggedIn: false,
            username: '',
            token:''

        })
    }
}

export default new UserStore();