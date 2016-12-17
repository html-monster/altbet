/**
 * User entity
 * Created by Vlasakh on 16.12.2016.
 */

export class User
{
    /**
     * account settings
     */
    public id = '';

    public settings = {
            basicMode: false,
            tradeOn: false,
            autoTradeOn: false,
        };



    /**
     * Whether user is authorized
     * @return number | Boolean
     */
    public isAuthorized()
    {
        return this.id != '' ? this.id : false;
    }
}