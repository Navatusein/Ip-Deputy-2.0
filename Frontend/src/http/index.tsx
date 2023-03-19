import axios from "axios";
import {userSlice} from "../store/reducers/UserSlice";
import {AppStore} from "../store/store";
import jwt_decode from "jwt-decode";
import {IJwtToken} from "../models/IJwtToken";

axios.defaults.withCredentials = true;

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

let store: AppStore;

export const injectStore = (_store: AppStore) => {
    store = _store
}

api.interceptors.request.use(async (config) => {
    let user = store.getState().userReducer.user;
    const {setUser} = userSlice.actions;

    if (user != null) {
        const decodedToken: IJwtToken = jwt_decode(user.jwtToken);

        if (decodedToken.exp * 1000 < Date.now() && decodedToken.refresh === 'true') {
            //TODO Remove log
            console.log("Refresh token");

            await axios.post(API_URL + '/authentication/refresh', user)
                .then(response => {
                    user = response.data;
                    store.dispatch(setUser(user));
                })
                .catch(error => {
                    console.error(error);
                    store.dispatch(setUser(null));
                });
        }

        config.headers["Authorization"] = 'Bearer ' + user.jwtToken;
    }

    return config;
});

export default api;