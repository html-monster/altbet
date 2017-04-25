/*eslint-disable */
export const ping = store => next => action => {
    console.group("Debug");
    console.log(`%cAction data: %c ${action.type}, дополнительные данные события: ${action.payload}`, 'background: #222; color: #bada55', 'background: #fff; color: #F00');
    console.log('store', store);
    console.log('action', action);
    console.groupEnd();
    return next(action);
};

// export const ping = function ping(store) {
//   return function (next) {
//     return function (action) {
//       console.log(`Тип события: ${action.type}, дополнительные данные события: ${action.payload}`, 'background: #222; color: #bada55');
//       return next(action);
//     };
//   };
// };
/*eslint-enable */
