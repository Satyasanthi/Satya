import { createStore } from 'redux';

// Initial state
const initialState = {
  email: null,
  firstName: null,
  lastName: null,
  imageUrl: '',
  isLoggedIn: false,
};

// Reducer function
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_FIRST_NAME':
      return { ...state, firstName: action.payload };
    case 'SET_LAST_NAME':
      return { ...state, lastName: action.payload };
    case 'SET_IMAGE_URL':
      return { ...state, imageUrl: action.payload };
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };
    default:
      return state;
  }
};

// Create the store
const store = createStore(userReducer);

export default store;
