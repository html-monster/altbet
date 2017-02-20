/**
 * Created by Vlasakh on 29.12.2016.
 */

/// <reference path="../../js/.d/common.d.ts" />

import Dialog from "../component/Dialog";
import {IndexView} from "../view/IndexView";
import CategoryModel from "../model/CategoryModel";
import {InfoMessage} from "../component/InfoMessage";
import {MainConfig} from "../inc/MainConfig";
import {TreeModel} from "../model/TreeModel";


export class GroupsTree
{
    private InfoMessage = null;


    constructor()
    {
        this.InfoMessage = new InfoMessage({
            TPLName: '#TPLinfoMessageAbs',
            target: "[data-js=DiInfoMP]",
            timeout: 5000,
        });
    }



    public init()
    {
        var self = this;

        $(document).on('dnd_stop.vakata', function(e, data)
        // $(document).on('move_node.jstree', function(e, data)
        {
          var src = $(data.element).closest('.jstree-node');
          var targetnode = $(data.event.target).closest('.jstree-node');

          // 0||console.log( 'parents', targetnode.parent().closest('.jstree-node').attr('id'), src.parent().closest('.jstree-node').attr('id') );
          if( targetnode.parent().closest('.jstree-node').attr('id') == src.parent().closest('.jstree-node').attr('id') )
          {
            // 0||console.log( 'targetnode, data', targetnode, src, data, targetnode.data('pos'), src.data('pos') );
            // src
            // move_node (obj, par [, pos, callback, is_loaded])
          }
          else
          {
          } // endif
        });

        $('#DiCatTree').jstree(
        {
            'core': {
                'check_callback' : function (operation, node, node_parent, node_position, more) {
                    // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                    // in case of 'rename_node' node_position is filled with the new node name
                    // 0||console.log( 'operation, node, node_parent, node_position, more', operation, node, node_parent, node_position, more );
                    // 0||console.log( 'node.data.pos, node_position', node.data.pos, node_position );
                    if( operation == 'move_node' && more.core )
                    {
                        0||console.log( 'more', more, operation, node_position, node.li_attr["data-id"] );
                        if (node.data.pos > node_position) node_position++;
                        self.moveCategory({node, node_parent, node_position});
                        0||console.log( '', node_position, node.li_attr["data-id"] );
                    } // endif

                    let flag = false;
                    if( operation == 'move_node' && node.parent == node_parent.id &&
                        (more.pos == 'a' && node.data.pos < node_position || more.pos == 'b' && node.data.pos > node_position) ) {flag = true; /*0||console.log( '$("#vakata-dnd")', $("#vakata-dnd").html() )*/;}
                    return flag;
                },
                'dnd': {
                    'check_while_dragging': false,
                }
            },
            "conditionalselect": function (node, event) {
                return false;
            },
            "types": {
                "fa-folder-o": {
                    "icon": "fa fa-folder-o"
                },
                // "demo": {
                //     "icon": "glyphicon glyphicon-ok",
                // }
            },
            "plugins": ["types", "conditionalselect", "dnd"]
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
                        location.href = result.url ? MainConfig.BASE_URL + result.url : MainConfig.BASE_URL;
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



    private moveCategory({node, node_parent, node_position})
    {
        var self = this;

        var formData = new FormData();
        formData.set('id', node.li_attr["data-id"]);
        formData.set('position', node_position);

        (new TreeModel).moveNode({formData, name: node.li_attr["data-name"]}).then( result =>
            {
                0||console.log( 'moved OK', 0 );
                // window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                // location.reload();
                // location.href = MainConfig.BASE_URL + result.data.Param1;
                $('#DiCatTree').jstree("move_node", node, node_parent, node_position);

                self.InfoMessage.render({
                    vars: {
                        header: "Info",
                        text: result.message,
                        type: InfoMessage.TYPE_SUCCESS,
                    }
                });
            },
            result => {
                self.InfoMessage.render({
                    vars: {
                        header: "Info",
                        text: result.message,
                        type: InfoMessage.TYPE_ALERT,
                    }
                });

                0||console.log( 'moved Fail', 0 );
            });
    }
}
