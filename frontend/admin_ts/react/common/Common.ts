/**
 * Common functions
 *
 * Created by Vlasakh on 22.12.2016.
 */

import {MainConfig, DS} from "../../inc/MainConfig"
declare var window;



export class Common
{
    public static showMessage(message, messageName)
    {
        let error = $('#global_message').clone(),
            windowHeight = $(window).outerHeight(),
            allMessages,
            position = 0,
            totalHeight = 0,
            ii = 1;

        error.removeAttr('id').addClass('clone ' + messageName);
        error.find('p').text(message);
        $('body').append(error);

        position = error.outerHeight(true);
        allMessages = $('.global_message_container.clone');
        allMessages.each(function () {
            let currentPosition = +$(this).css('bottom').replace('px', '');

            totalHeight += $(this).outerHeight(true);

            if (allMessages.length != ii++) {
                $(this).css('bottom', currentPosition + position);
            }

            if (totalHeight > windowHeight)
                allMessages.eq(0).remove();
        });
        error.hide().fadeIn(200)
            .removeClass('bounceOutRight').addClass('bounceInRight active');
    }


    /**
     * Convert spaces in the input string
     * @param inStr
     * @return {string}
     */
    public static createUrlAlias(inStr)
    {
        return inStr.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/[ ]/g, "-").toLowerCase();
    }


    /**
     * Redirect browser
     * @param inStr
     */
    public static redirect(inStr)
    {
        location.href = inStr;
    }


    /**
     * Redirect browser with message
     * @param inStr
     */
    public static redirectWMessage({url, message, type, title, exInfo})
    {
        //InfoMessage.TYPE_SUCCESS
        // emulate
        url = url.replace("\u0026", "&");
        // url = MainConfig.BASE_URL + DS + url;

        window.ADpp.User.setFlash({message: message, type: type, header: title, ...exInfo}, 'AddExchSucc');
        location.href = MainConfig.BASE_URL + url;
    }


    /**
     * format number to some digits after coma
     * @param value
     * @param precision
     * @return {string}
     */
    public static toFixed(value, precision = 2) : any {
        return (Math.round(value * 100) / 100).toFixed(precision);
    }



    /**
     * Two objects deep compare
     * @return {boolean}
     */
    public static deepCompare()
    {
        var i, l, leftChain, rightChain;

        function compare2Objects(x, y) {
            var p;

            // remember that NaN === NaN returns false
            // and isNaN(undefined) returns true
            if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
                return true;
            }

            // Compare primitives and functions.
            // Check if both arguments link to the same object.
            // Especially useful on the step where we compare prototypes
            if (x === y) {
                return true;
            }

            // Works in case when functions are created in constructor.
            // Comparing dates is a common scenario. Another built-ins?
            // We can even handle functions passed across iframes
            if ((typeof x === 'function' && typeof y === 'function') ||
                (x instanceof Date && y instanceof Date) ||
                (x instanceof RegExp && y instanceof RegExp) ||
                (x instanceof String && y instanceof String) ||
                (x instanceof Number && y instanceof Number)) {
                return x.toString() === y.toString();
            }

            // At last checking prototypes as good as we can
            if (!(x instanceof Object && y instanceof Object)) {
                return false;
            }

            if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                return false;
            }

            if (x.constructor !== y.constructor) {
                return false;
            }

            if (x.prototype !== y.prototype) {
                return false;
            }

            // Check for infinitive linking loops
            if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
                return false;
            }

            // Quick checking of one object being a subset of another.
            // todo: cache the structure of arguments[0] for performance
            for (p in y) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }
            }

            for (p in x) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }

                switch (typeof (x[p])) {
                    case 'object':
                    case 'function':

                        leftChain.push(x);
                        rightChain.push(y);

                        if (!compare2Objects(x[p], y[p])) {
                            return false;
                        }

                        leftChain.pop();
                        rightChain.pop();
                        break;

                    default:
                        if (x[p] !== y[p]) {
                            return false;
                        }
                        break;
                }
            }

            return true;
        }

        if (arguments.length < 1) {
            return true; //Die silently? Don't know how to handle such case, please help...
            // throw "Need two or more arguments to compare";
        }

        for (i = 1, l = arguments.length; i < l; i++) {

            leftChain = []; //Todo: this can be cached
            rightChain = [];

            if (!compare2Objects(arguments[0], arguments[i])) {
                return false;
            }
        }

        return true;
    }


    /**
     * @param needle
     * @param haystack
     * @return {boolean}
     */
    public static inArray(needle, haystack) : boolean
    {
        return haystack.some(vv => vv == needle);
    }


    public static lastItem(inArr)
    {
        return inArr[inArr.length-1];
    }


    public static isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
}