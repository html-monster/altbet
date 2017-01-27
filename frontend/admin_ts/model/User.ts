/**
 * Created by tianna on 07.01.17.
 */

export class User
{
    public static MESSAGE_TYPE_ABS = 1;


    /**
     * set user data to use after page reload
     * @param inName
     * @param inVal
     */
    public setFlash(inVal, inName = 'UserFlash')
    {
        localStorage.setItem(inName, JSON.stringify(inVal))
    }



    /**
     * read user data
     * @param inName
     * @param inVal
     */
    public getFlash(inName = 'UserFlash')
    {
        var data;
        if( (data = localStorage.getItem(inName)) == '' )
        {
            data = false;
        }
        else
        {
            data = JSON.parse(data);
            localStorage.removeItem(inName);
        } // endif

        return data;
    }
}