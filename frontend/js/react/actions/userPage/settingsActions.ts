/**
 * Created by Htmlbook on 10.03.2017.
 */
import {
    SETTING_ON_FILE_LOAD,
    SETTING_CHANGE_PROGRESS_BAR
} from "../../constants/ActionTypesSetting";
import BaseActions from '../BaseActions';

class Actions extends BaseActions
{
    public actionAjaxUserDataUpdate(values, serverValidation, event)
    {
        return () =>
        {
            __DEV__ && console.log('UserDataUpdate:', values);
            const form = $(event.target);
            const submit = $(event.target).find('[type=submit]');

            defaultMethods.sendAjaxRequest({
                httpMethod: 'POST',
                url       : $(event.target).attr('action'),
                data      : values,
                callback  : onSuccessAjax,
                onError   : onErrorAjax,
                beforeSend: OnBeginAjax,
            });

            function onErrorAjax()
            {
                submit.removeAttr('disabled');
                form.removeClass('loading');
                serverValidation({error: 'The payment failed. Please check your internet connection or reload the page or try again later'});
            }

            function OnBeginAjax()
            {
                submit.attr('disabled', 'true');
                form.addClass('loading');
            }

            function onSuccessAjax(error)
            {
                __DEV__ && console.log(error);
                if(error) serverValidation({error});
                else serverValidation({message: 'Your data was successfully changed'});
                submit.removeAttr('disabled');
                form.removeClass('loading');
            }
        }
    }

    public onFileChosen(context, event)
    {
        return (dispatch) =>
        {
            context.props.actions.addFile({
                id: (new Date).getTime(),
                fileType: 'load'
            });
            $.ajax({
                url: `${ABpp.baseUrl}/Payment/NetellerIn`,
                type: 'POST',
                // Form data
                data: new FormData(context.refs.uploadForm),
                cache: false,
                contentType: false,
                processData: false,
                xhr: function() {
                    let myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', function(event) {
                            let percent = 0;
                            let position = event.loaded || event.position;
                            let total = event.total;
                            if (event.lengthComputable) {
                                percent = Math.ceil(position / total * 100);
                            }
                            dispatch({
                                type: SETTING_CHANGE_PROGRESS_BAR,
                                payload: percent,
                            });
                        } , false);
                    }
                    return myXhr;
                },
                mimeType:"multipart/form-data",
                success,
                // error: onError,
                beforeSend
            });

            function beforeSend(){
                $(context.refs.uploadButton).attr('disabled', 'true');
            }

            function success(){
                dispatch({
                    type: SETTING_CHANGE_PROGRESS_BAR,
                    payload: 0,
                });
                context.props.actions.addFile(item);
                $(context.refs.uploadButton).removeAttr('disabled');
            }

            //for testing====================
            let item : any = {};
            const loadFileData = event.target.files[0];
            const type = (loadFileData.type).split('/')[0];
            const extension = (loadFileData.name).split('.')[1];

            // console.dir(event.target.files[0]);
            if(type == 'image'){
                item.thumbUrl = `${ABpp.baseUrl}/Images/first_page/fp_bg6.jpg`;
                item.fileUrl = `${ABpp.baseUrl}/Images/first_page/fp_bg6.jpg`;
            }
            else{
                item.fileUrl = `${ABpp.baseUrl}/Images/test.${extension}`;
            }
            item.name = loadFileData.name;
            item.extension = extension;
            item.fileType = type;
            item.size = loadFileData.size;
            item.id = (new Date).getTime();
            //for testing====================
            // context.props.actions.addFile(item);
        }
    }

    public removeFile(id)
    {
        return (dispatch, getState) =>
        {
            let newArr = getState().accountSetting.files.slice().filter((item) => id != item.id);

            dispatch({
                type: SETTING_ON_FILE_LOAD,
                payload: newArr,
            });
        }
    }

    public addFile(item)
    {
        return (dispatch, getState) =>
        {
            let newArr = item.fileType == 'load' ?
                getState().accountSetting.files.slice()
                :
                getState().accountSetting.files.slice(0, -1);

            newArr.push(item);

            dispatch({
                type: SETTING_ON_FILE_LOAD,
                payload: newArr,
            });
        }
    }

}

export default (new Actions()).export();