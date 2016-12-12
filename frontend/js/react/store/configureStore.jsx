import { createStore, applyMiddleware } from 'redux'
// import { createStore } from 'redux'
// import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

// import { ping } from './enhancers/ping'
import rootReducer from '../reducers/index.jsx';


export default function configureStore(initialState)
{
    // const store = createStore(rootReducer, initialState);
    const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
    // const logger = createLogger();
    // const store = createStore(rootReducer, initialState, applyMiddleware(logger));
    // if (module.hot)
    // {
    //     module.hot.accept('../reducers', () => {
    //         const nextRootReducer = require('../reducers');
    //         store.replaceReducer(nextRootReducer);
    //     })
    // }
    return store;
}
