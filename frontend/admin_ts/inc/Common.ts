/**
 * Created by Vlasakh on 05.01.2017.
 */

declare var Promise;

export default class Common
{
    public static sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
}