/**
 * Created by Htmlbook on 10.03.2017.
 */
import {
    SETTING_ON_FILE_LOAD,
    SETTING_CHANGE_PROGRESS_BAR,
    SETTING_LOAD_FILE_ERROR,
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
        return (dispatch, getState) =>
        {
            let loadFileData = event.target.files;
            let extension, fileSize = 0, valid = true;
            const sizeLimit = 4000000;
            const loadId = (new Date).getTime();

            dispatch({
                type: SETTING_LOAD_FILE_ERROR,
                payload: '',
            });

            if(loadFileData.length + getState().accountSetting.files.length > 6){
                dispatch({
                    type: SETTING_LOAD_FILE_ERROR,
                    payload: `The maximum number of files stored on the server is 6`,
                });
                return false;
            }
            $(loadFileData).each(function() {
                extension = (this.name).split('.');
                extension = extension[extension.length - 1];
                if(extension != 'jpg' && extension != 'jpeg' && extension != 'png' && extension != 'doc' && extension != 'docx'
                && extension != 'xls' && extension != 'xlsx' && extension != 'txt'){
                    dispatch({
                        type: SETTING_LOAD_FILE_ERROR,
                        payload: `${this.name} is unsupported file type`,
                    });
                    valid = false;
                }

                fileSize += this.size;
            });

            if(!valid) return valid;

            if(fileSize >= 4000000){
                dispatch({
                    type: SETTING_LOAD_FILE_ERROR,
                    payload: `You have ${loadFileData.length} file(s) with total size ${Math.round10(fileSize / 1000000, 
                        -2)} MB , Allowed size is ${Math.round10(sizeLimit / 1000000, -2)} MB, Try smaller file`,
                });
                return false;
            }


            $.ajax({
                url: `${ABpp.baseUrl}/Account/ChangePassword`,
                type: 'POST',
                // Form data
                data: new FormData(context.refs.uploadForm),
                cache: false,
                contentType: false,
                processData: false,
                xhr: function()
                {
                    let myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        context.props.actions.addFile([{
                            id: loadId,
                            fileType: 'load'
                        }]);
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
                error,
                beforeSend
            });

            function error()
            {
                // context.props.actions();
                dispatch({
                    type: SETTING_LOAD_FILE_ERROR,
                    payload: 'Loading file failed. Please check your internet connection or reload the page or try again later',
                });
                context.props.actions.removeFile(loadId);
                $(context.refs.uploadButton).removeAttr('disabled');
            }

            function beforeSend()
            {
                $(context.refs.uploadButton).attr('disabled', 'true');
            }

            function success(answer)
            {
                // data - сделать обработку ошибок от сервера
                dispatch({
                    type: SETTING_CHANGE_PROGRESS_BAR,
                    payload: 0,
                });
                context.props.actions.addFile(answer);
                $(context.refs.uploadButton).removeAttr('disabled');
            }

            //for testing====================
            // let items = [];
            // $(loadFileData).each(function(index) {
            //     let item : any = {};
            //     const type = (this.type).split('/')[0];
            //     extension = (this.name).split('.');
            //     extension = extension[extension.length - 1];
            //     // console.dir(event.target.files[0]);
            //     if(type == 'image'){
            //         item.thumbUrl = `${ABpp.baseUrl}/Images/first_page/fp_bg6.jpg`;
            //         item.fileUrl = `${ABpp.baseUrl}/Images/first_page/fp_bg6.jpg`;
            //     }
            //     else{
            //         item.fileUrl = `${ABpp.baseUrl}/Images/test.${extension}`;
            //     }
            //     item.name = this.name;
            //     item.extension = extension;
            //     item.fileType = type;
            //     item.size = this.size;
            //     item.id = (new Date).getTime() + index;
            //
            //     items.push(item);
            // });
            // console.log(items);
            //for testing====================
            // context.props.actions.addFile(item);
        }
    }

    public addFile(items)
    {
        return (dispatch, getState) =>
        {
            let newArr = items[0].fileType == 'load' ?
                getState().accountSetting.files.slice()
                :
                getState().accountSetting.files.slice(0, -1);

            newArr = newArr.concat(items);
            console.log('newItems:', items);
            console.log('newArr:', newArr);
            dispatch({
                type: SETTING_ON_FILE_LOAD,
                payload: newArr,
            });
        }
    }

    public ajaxDeleteFile(context, id, event)
    {
        return (dispatch) =>
        {
            const button = event.target;
            event.preventDefault();
            dispatch({
                type: SETTING_LOAD_FILE_ERROR,
                payload: '',
            });

            defaultMethods.sendAjaxRequest({
                httpMethod: 'POST',
                url       : `${ABpp.baseUrl}/Account/ChangePassword`,
                data      : {id},
                callback  : onSuccessAjax,
                onError   : onErrorAjax,
                beforeSend: OnBeginAjax,
            });

            function onSuccessAjax(data)
            {
                // data - сделать обработку ошибок от сервера
                context.props.actions.removeFile(id);
                $(button).removeAttr('disabled');
            }

            function OnBeginAjax()
            {
                $(button).attr('disabled', 'true');
            }

            function onErrorAjax()
            {
                dispatch({
                    type: SETTING_LOAD_FILE_ERROR,
                    payload: 'Deleting file failed. Please check your internet connection or reload the page or try again later',
                });
                $(button).removeAttr('disabled');
            }
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

}

export default (new Actions()).export();