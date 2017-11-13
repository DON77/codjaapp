import * as LOGIN from '../../actions/login/types';

export const LoginReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN.GET_LOGIN_SUCCESS:
      return { ...state, user: action.data };
    case LOGIN.GET_LOGIN_FAIL:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

