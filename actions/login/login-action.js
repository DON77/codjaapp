import axios from 'axios';
import * as LOGIN from './types';
import configs from '../../app.config'


export function login(email, password) {
  return dispatch => {
    return fetch(`${configs.apiUrl}owner/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({ type: LOGIN.GET_LOGIN_SUCCESS, data: responseJson.data });
    })
    .catch((error) => {
      dispatch({ type: LOGIN.GET_LOGIN_FAIL, payload: error });
    });
  };
}
