import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Config } from '../Config'
import { AsyncStorage } from 'react-native';
const AuthContext = createContext();

function AuthContextProvider(props) {
    const [loggedIn, setLoggedIn] = useState(undefined);
    const [refreshToken, setRefreshToken] = useState('');
    const [accessToken, setAccessToken] = useState('')
    const [ATExpire, setATExpire] = useState(null)
    const [RTExpire, setRTExpire] = useState(null);
    const [perfil, setPerfil] = useState(null);

    async function saveLocalStorage() {
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('perfil', JSON.stringify(perfil));
    }

    async function clearLocalStorage() {
        await AsyncStorage.clear()
        set({
            accessToken: '',
            LoggedIn: false,
            refreshToken: '',
            ATExpire: null,
            RTExpire: null,
            profile: null
        })
    }

    function set({ accessToken, refreshToken, ATExpire, RTExpire, LoggedIn, profile }) {
        if (profile) { setPerfil(profile) }
        if (accessToken) { setAccessToken(accessToken) }
        if (refreshToken) { setRefreshToken(refreshToken) }
        if (ATExpire) { setATExpire(ATExpire) }
        if (RTExpire) { setRTExpire(RTExpire) }
        if (LoggedIn) { setLoggedIn(LoggedIn) }
    }
    function get(string) {
        switch (string) {
            case "at":
                return (accessToken)
            case "rt":
                return (refreshToken)
            default:
                return "Que carajeanos"
        }
    }
    async function getAccessToken() {
        const rt = await AsyncStorage.getItem("refreshToken")
        setRefreshToken(rt)
        try {
            if (rt) {
                const { data } = await axios.get(Config.API_URL + "/auth/token", {
                    headers: {
                        'x-refresh-token': rt
                    }
                });
                // console.info(data);
                setAccessToken(data.accessToken);
                setATExpire(data.ATExpiresIn)
                setRTExpire(data.RTExpiresIn)
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
                clearLocalStorage();
            }
        } catch (error) {
            console.error(error?.response?.data?.message || error.message);
            setLoggedIn(false);
            clearLocalStorage();
        }
    }

    useEffect(() => { //Pedir un nuevo access token
        const now = Date.now()
        const falta = ATExpire - now;
        if (falta < 0) return;
        setTimeout(() => {
            getAccessToken();
        }, falta - 15000);
        // eslint-disable-next-line
    }, [ATExpire, RTExpire]);

    useEffect(() => {
        getAccessToken();
        // eslint-disable-next-line
    }, []);

    return <AuthContext.Provider value={{ loggedIn, saveLocalStorage, clearLocalStorage, set, get, getAccessToken, perfil }}>
        {props.children}
    </AuthContext.Provider>
}
export default AuthContext;
export { AuthContextProvider };