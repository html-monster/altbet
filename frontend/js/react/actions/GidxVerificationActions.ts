import {
    SETTING_LOAD_FILE_ERROR,
    SETTING_CHANGE_PROGRESS_BAR,
    SETTING_ON_FILE_LOAD,
} from '../constants/ActionTypesGidxVerification.js';
import BaseActions from './BaseActions';
import {AjaxSend} from '../models/AjaxSend';
// import {MainConfig} from '../../inc/MainConfig';


var __DEBUG__ = !true;


export default class Actions extends BaseActions
{
    public actionOnFileChosen({uploadForm, uploadButton}, event)
    {
        var self = this;

        return (dispatch, getState) =>
        {
            const { gidxVerification: {files, config} } = getState();
            let loadFileData = event.target.files;
            let extension, fileSize = 0, valid = true;
            const sizeLimit = 2000000;
            const loadId = (new Date).getTime();

            dispatch({
                type: SETTING_LOAD_FILE_ERROR,
                payload: '',
            });

            if(loadFileData.length + files.length > config.maxFiles){
                dispatch({
                    type: SETTING_LOAD_FILE_ERROR,
                    payload: `The maximum number of files stored on the server is 6`,
                });
                return false;
            }
            $(loadFileData).each(function() {
                extension = (this.type).split('/')[1];
                // extension = extension[extension.length - 1];
                if(extension != 'jpg' && extension != 'jpeg' && extension != 'png'){
                    //&& extension != 'doc' && extension != 'docx' && extension != 'xls' && extension != 'xlsx' && extension != 'txt'
                    dispatch({
                        type: SETTING_LOAD_FILE_ERROR,
                        payload: `${this.name} is unsupported file type`,
                    });
                    valid = false;
                }

                fileSize += this.size;
            });

            if(!valid) return valid;

            if(fileSize >= sizeLimit){
                dispatch({
                    type: SETTING_LOAD_FILE_ERROR,
                    payload: `You have ${loadFileData.length} file(s) with total size ${Math.round10(fileSize / 1000000, 
                        -2)} MB , Allowed size is ${Math.round10(sizeLimit / 1000000, -2)} MB, Try smaller file`,
                });
                return false;
            }

            if (fileSize)
                defaultMethods.sendAjaxRequest({
                    url: `${ABpp.baseUrl}/Account/UploadImage`,
                    data: new FormData(uploadForm),
                    cache: false,
                    contentType: false,
                    processData: false,
                    xhr: function()
                    {
                        let myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) {
                            self.addFile({
                                Name: loadId,
                                ContentType: 'load'
                            });
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
                    mimeType: "multipart/form-data",
                    callback: success,
                    onError: error,
                    beforeSend
                });

            function error()
            {
                dispatch({
                    type: SETTING_LOAD_FILE_ERROR,
                    payload: 'Loading file failed. Please check your internet connection or reload the page or try again later',
                });
                self.removeFile(loadId);
                $(uploadButton).removeAttr('disabled');
            }

            function beforeSend()
            {
                $(uploadButton).attr('disabled', 'true');
            }

            function success(answer)
            {
                __DEV__ && console.log('answer:', answer);

                switch (answer.ErrorCode){
                    case 200:{
                        self.addFile(answer);
                        break;
                    }
                    case 100:{
                        self.removeFile(loadId);
                        __DEV__ && console.error('You tried to load empty files object');
                        break;
                    }
                    case 101:{
                        self.removeFile(loadId);
                        dispatch({
                            type: SETTING_LOAD_FILE_ERROR,
                            payload: `${this.name} is unsupported file type`,
                        });
                        break;
                    }
                    case 102:{
                        self.removeFile(loadId);
                        dispatch({
                            type: SETTING_LOAD_FILE_ERROR,
                            payload: `You have ${loadFileData.length} file(s) with total size ${Math.round10(fileSize / 1000000,
                                -2)} MB , Allowed size is ${Math.round10(sizeLimit / 1000000, -2)} MB, Try smaller file`,
                        });
                        break;
                    }
                    case 103:{
                        self.removeFile(loadId);
                        dispatch({
                            type: SETTING_LOAD_FILE_ERROR,
                            payload: `File ${this.name} has not been saved. Try again or reload the page, or try again later`,
                        });
                        break;
                    }
                }

                dispatch({
                    type: SETTING_CHANGE_PROGRESS_BAR,
                    payload: 0,
                });
                $(uploadButton).removeAttr('disabled');
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


    /**
     * Get new events data
     */
/*
    public actionGetNewTableData({props, callback})
    {
        return (dispatch, getState) =>
        {
            const ajaxPromise = (new AjaxSend()).send({
                formData: props,
                type: 'GET',
                message: `Error while get new data from server`,
                url: ABpp.baseUrl + '',
            });


            ajaxPromise.then( result =>
                {
                    0||console.log( 'result', result );
                    dispatch({
                        type: ON_BALVAN,
                        payload: this.some.bind(this, {Model: result.data.Model, callback}),
                    });
                },
                result => {
                    0||console.log( 'result', result );
                    callback && callback({errorCode: -100, title: 'Warning', message: result.message})
                });
        };
    }
*/


    /**
     * Add team player action
     */
/*
    public actionPPGValues(inProps)
    {
        return (dispatch, getState) =>
        {
            setTimeout(() => {
                dispatch({
                    type: ON_GET_NEW_TABLE_DATA,
                    payload: inProps, //this.setPPGValues.bind(this, inProps),
                    // payload: this.setPPGValues.bind(this, inProps),
                })},
                500
            );

            // .data.Model
        };
    }
*/


    public addFile(items)
    {
        return (dispatch, getState) =>
        {
            let newArr = items.ContentType == 'load' ?
                getState().accountSetting.files.slice()
                :
                getState().accountSetting.files.slice(0, -1);

            newArr = newArr.concat(items);
            dispatch({
                type: SETTING_ON_FILE_LOAD,
                payload: newArr,
            });
        }
    }


    public removeFile(id)
    {
        return (dispatch, getState) =>
        {
            let newArr = getState().accountSetting.files.slice().filter((item) => id != item.Name);

            dispatch({
                type: SETTING_ON_FILE_LOAD,
                payload: newArr,
            });
        }
    }
}
