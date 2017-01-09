/**
 * Created by tianna on 07.01.17.
 */

export class User
{
    /**
     * set user data to use after page reload
     * @param inName
     * @param inVal
     */
    public setFlash(inVal)
    {
        localStorage.setItem('UserFlash', JSON.stringify(inVal))
    }



    /**
     * read user data
     * @param inName
     * @param inVal
     */
    public getFlash()
    {
        var data;
        if( (data = localStorage.getItem('UserFlash')) == '' )
        {
            data = false;
        }
        else
        {
            data = JSON.parse(data);
            localStorage.removeItem('UserFlash');
        } // endif

        return data;
    }
}