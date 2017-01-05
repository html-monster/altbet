/**
 * Created by Vlasakh on 05.01.2017.
 */

import { MainConfig, DS } from "../inc/MainConfig";


export default class CategoryModel
{
    public saveCategory(data)
    {
        0||console.debug( 'data', data );
/*
        var self = this;


            data = {code: 100};
        // $.post(MainConfig.BASE_URL + DS + MainConfig.AJAX_CATEGORY_EDIT, data, function (data)
        $.ajax({
            url: MainConfig.BASE_URL + DS + MainConfig.AJAX_CATEGORY_EDIT,  //server script to process data
            type: 'POST',
            success: function(data)
            {
                var error = 0;
                var message = 'E';
                try
                {
                    data = JSON.parse(data);

                    // some custom error
                    if( data.error < 0 )
                    {
                        if( data.ret ) console.warn( 'ret', data.ret );
                        // throw { message: data.message, code: -101 };
                        error = data.error;
                        throw new Error(data.message);

                    // success
                    } else if (data.error == 100)
                    {
                        self.files = data['files'];

                        // onAfterUpload hook, before data proccess
                        opts.onAfterUpload && (data = opts.onAfterUpload(data));

                        // image uploaded
                        if( data['file']['meta']['type'] == 'images' )
                        {
                            var imgTpl = $('.'+self.props.imgBlockTmpl).clone();
                            imgTpl.find('.uni-img').attr('src', data['file']['files']['tb']);

                            // add img clickable
                            if( data['file']['files']['orig'] )
                                // if( self.props.downloadUrl ) imgTpl.find('.uni-img-link').attr('href', self.props.downloadUrl + `f=${data['file']['files']['orig']}`);
                                // else
                                imgTpl.find('.uni-img-link').attr('href', data['file']['files']['orig']);


                            // delete
                            imgTpl.find('.uni-del').attr('data-id', data['id']).click(function (e) { self.onFileDelete(e, this) });

                            imgTpl.hide().removeClass(`tmpl ${self.props.imgBlockTmpl}`).addClass('uni-img-block');
                            $(self.props.imgsWrapper).append(imgTpl);
                            imgTpl.slideDown(400);


                        // file uploaded
                        } else {
                            var fileTpl = $('.'+self.props.filesBlockTmpl).clone();
                            fileTpl.removeClass('tmpl');
                            // fileTpl.find('.uni-img').attr('src', data['file']['files']['tb']);

                            // add img clickable
                            if( data['file']['files']['orig'] )
                                // if( self.props.downloadUrl ) fileTpl.find('.uni-link').attr('href', self.props.downloadUrl + `f=${data['file']['files']['orig']}`);
                                // else
                                fileTpl.find('.uni-link').attr('href', data['file']['files']['orig']);
                            fileTpl.find('.uni-link').text(data['file']['meta']['name']);

                            // delete
                            fileTpl.find('.uni-del').attr('data-id', data['id']).click(function (e) { self.onFileDelete(e, this) });

                            let ext = data['file']['files']['orig'].substr(data['file']['files']['orig'].lastIndexOf('.')+1);

                            fileTpl.addClass('-' + ext).hide().removeClass(self.props.filesBlockTmpl).addClass('uni-file-block');
                            $(self.props.filesWrapper).append(fileTpl);
                            fileTpl.slideDown(400);
                        } // endif
                    } // endif

                    opts.onSuccessEnd && opts.onSuccessEnd(imgTpl ? imgTpl : fileTpl);

                } catch (e) {
                    var code = error;
                    if( code !== 0 ) message = e.message;
                    error = 1;
                }

                if( error )
                {
                    self.props.messageBlock && form.find(self.props.messageBlock).text(message);
                    console.warn( 'E', code );
                } // endif
            },
            error: function() {
                form.find('.message').text(_t('fileLoad'));
            },
            // Form data
            data: formData,
            // Options to tell jQuery not to process data or worry about the content-type
            cache: false,
            contentType: false,
            processData: false
        }, 'json')
        .always(function () {
            // form.find('.loading-ico').fadeOut(200);
        })
*/
    }
}
