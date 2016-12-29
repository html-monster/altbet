/**
 * Created by Vlasakh on 27.12.2016.
 */

/// <reference path="./../js/.d/common.d.ts" />
/// <reference path="./../js/.d/jquery.d.ts" />


$(document).ready(function() {
    0||console.debug( 'ready hello 2222222222222' );

// return;

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
//        $('#container23').jstree();
});