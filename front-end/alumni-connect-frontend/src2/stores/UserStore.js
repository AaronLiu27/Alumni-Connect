import {extendObservable} from 'mobx';


class UserStor {
    constructor() {
        extendObservable(this, {

            loading: true,
            isLoggedIn: false,
            username: ''

        })
    }
}

export default new UserStor();