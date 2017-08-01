import { createStore, applyMiddleware } from 'redux'
// import { createStore } from 'redux'
// import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

// import { ping } from './enhancers/ping'
import getRootReducer from '../reducers/indexReducer';


export default function configureStore(initialState)
{
    // const store = createStore(getRootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk));
    const store = createStore(getRootReducer(), initialState, applyMiddleware(thunk));

    // const store = createStore(getRootReducer, initialState);
    // const logger = createLogger();
    // const store = createStore(getRootReducer, initialState, applyMiddleware(logger));
    // if (module.hot)
    // {
    //     module.hot.accept('../reducers', () => {
    //         const nextRootReducer = require('../reducers');
    //         store.replaceReducer(nextRootReducer);
    //     })
    // }
    return store;
}
