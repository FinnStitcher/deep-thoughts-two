import decode from 'jwt-decode';

class AuthService {
    // lets make some methods baby
    getProfile() {
        // decode the token retrieved from the other method
        return decode(this.getToken());
    };

    getToken() {
        // get user token from localStorage
        return localStorage.getItem('id_token');
    };

    isTokenExpired(token) {
        try {
            const decoded = decode(token);

            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    };

    loggedIn() {
        // check if theres a valid saved token
        const token = this.getToken();

        // double bang forces token into a boolean
        return !!token && !this.isTokenExpired(token);
    };

    login(idToken) {
        // put token in localStorage
        localStorage.setItem('id_token', idToken);

        // send to main page (reloads)
        window.location.assign('/');
    };

    logout() {
        // delete token
        localStorage.removeItem('id_token');

        // send to main page
        window.location.assign('/');
    };
};

// anything importing from this file will be getting a new instance
// this avoids the risk of remnant data hanging around
export default new AuthService();