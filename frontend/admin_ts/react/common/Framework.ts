/**
 * Created by Vlasakh on 05.07.17.
 */


export class Framework
{
    /**
     * Init reducer and export action processor
     * @param Reducer
     * @return actionsHandler
     */
    public static getHandler(Reducer)
    {
        const $Reducer = new Reducer();
        return $Reducer.actionsHandler.bind($Reducer);
    }


    /**
     * Init actions
     * @param Actions
     * @return object
     */
    public static initAction(Actions)
    {
        return (new Actions()).export();
    }
}