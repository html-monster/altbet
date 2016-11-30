import { GET_PHOTOS_REQUEST, GET_PHOTOS_SUCCESS, GET_PHOTOS_FAIL } from '../constants/Page'


const initialState = {
  year: 2016,
  photos: [],
  fetching: false,
  error: ''
};


export default function page(state = initialState, action)
{
    switch (action.type) {
        case GET_PHOTOS_REQUEST:
            return {...state, year: action.payload, fetching: true, error: ''};

        case GET_PHOTOS_SUCCESS:
            return {...state, photos: action.payload, fetching: false, error: ''};

        case GET_PHOTOS_FAIL:
            var res = {...state, fetching: false, error: 'true'};
            // 0||console.warn( 'res', res );
            return res;

        default:
            return state;
    }
}
