import { LOGIN_SUCCES, LOGIN_FAIL } from '../../constants/User';


const initialState = {
  chartId: appData.pageEventData.chartId,
};


export default function user(state = initialState, action)
{
  switch(action.type) {
    case LOGIN_SUCCES:
      return { ...state, name: action.payload, error: '' }

    default:
      return state
  }

}