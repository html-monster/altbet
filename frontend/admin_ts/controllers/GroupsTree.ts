/**
 * Created by Vlasakh on 29.12.2016.
 */

/// <reference path="../../js/.d/common.d.ts" />

import Dialog from "../component/Dialog";


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
        0||console.debug( '$that.data(url)', $that.data('url') );

        if( $that.data('type') == 'del' )
        {
            new Dialog({
                TPLName: '#TPLmodalDialog',
                target: '.js-dialog',
                render: true,
                vars: {
                    title: 'Warning',
                    modalBody: 'Delete category “' + $that.data('catname') + '” ?',
                    btnOkTitle: 'Delete',
                    btnCancelTitle: 'Cancel',
                    type: 'modal-danger',
                },
                callbackOK: function() { alert('deleted') }
            });
        }
        else
        {
            location.href = $that.data('url');
        } // endif
    }
}
