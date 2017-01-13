/**
 * Created by Vlasakh on 29.12.2016.
 */

/// <reference path="../../js/.d/common.d.ts" />

import Dialog from "../component/Dialog";
import {IndexView} from "../view/IndexView";
import CategoryModel from "../model/CategoryModel";
import {InfoMessage} from "../component/InfoMessage";
import {MainConfig} from "../inc/MainConfig";


export class GroupsTree
{
    public init()
    {
        var self = this;

        $('#DiCatTree').jstree(
        {
            "types": {
                "fa-folder-o": {
                    "icon": "fa fa-folder-o"
                },
                // "demo": {
                //     "icon": "glyphicon glyphicon-ok"
                // }
            },
            "plugins": ["types"]
        });

        // 0||console.debug( '$(".sidebar-menu .js-treeview.active")', $(".sidebar-menu .treeview.active") );

        // open category tree for default
        $(".js-tree-menu-item").click();



        // 0||console.debug( '#DiCatTree .js-controls .js-btn', $('#DiCatTree .js-controls .js-btn') );
        $('#DiCatTree').on('click', '.js-controls .js-btn', function (e) { self.onTreeControlClick(e, this); });
    }



    public onTreeControlClick(e, that)
    {
        var $that = $(that);
        // 0||console.debug( '$that.data(url)', $that.data('url') );

        let indexView = new IndexView();

        // if delete button clicked
        if( $that.data('type') == 'del' )
        {
            var $Dialog = new Dialog({
                TPLName: '#TPLmodalDialog',
                target: '.js-mp-dialog',
                render: true,
                vars: {
                    title: 'Warning',
                    modalBody: 'Delete category “' + $that.data('catname') + '” ?',
                    btnOkTitle: 'Delete',
                    btnCancelTitle: 'Cancel',
                    type: 'modal-danger',
                },
                callbackCancel: function() { indexView.endDelete() },
                callbackOK: function()
                {
                    indexView.beginDelete();

                    // var formData = new FormData();
                    // formData.set('url', '1');
                    (new CategoryModel).deleteCategory({url: $that.data('url'), name: $that.data('catname')}).then( result =>
                    {
                        window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                        indexView.endDelete();
                        location.href = MainConfig  .BASE_URL + result.url;
                    },
                    result => {
                        window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_ALERT, header: "Fail"});
                        indexView.setInfoMess();
                        // categoryEdit.setErrors({code: reuslt.code, message: reuslt.message});
                        // indexView.endDelete();
                        $Dialog.close();
                    });

                    return false;
                }
            });
        }
        else
        {
            location.href = $that.data('url');
        } // endif
    }
}
