/**
 * User entity
 * Created by Vlasakh on 16.12.2016.
 */

export class User
{
    public userIdentity = globalData.userIdentity == 'True';

    /**
     * account settings
     */
    // public id = '';
    public login = '';

    public settings : any = {
            basicMode: false,
            tradeOn: false,
            autoTradeOn: false,
        };


    constructor()
    {
        this.login = globalData.userLogin;
    }



    /**
     * Whether user is authorized
     * @return number | Boolean
     */
    public isAuthorized()
    {
        return this.login != '';
    }
}
