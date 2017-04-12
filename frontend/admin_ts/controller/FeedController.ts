/**
 * Created by Vlasakh on 11.04.2017.
 */

import BaseController from "./BaseController";
import {FeedView} from "../view/FeedView";
import {FeedModel} from "../model/FeedModel";
// import Dialog from "../component/Dialog";
// import {FormCheckers} from "../component/FormCheckers";
// import {MainConfig} from "../inc/MainConfig";
// import {InfoMessage} from "../component/InfoMessage";
// import {messageBox, AlertBox} from "../component/AlertBox";
// import {User} from "../model/User";


export class FeedController extends BaseController
{
    constructor()
    {
        super();
    }


    public actionView()
    {
        var self = this;

        let $FeedView = (new FeedView(new FeedModel()));
        $FeedView.init();


        // edit click
        // $('[data-js=tabl-exch]').on('click', '.js-btn-crud[data-type=edit]', function (e) { self.onEditControlClick(e, this); });
    }



    private onEditControlClick(e, that)
    {
        var self = this;
        var $that = $(that);

        e.preventDefault();

//         let $IndexView = (new IndexView);
//         let $ExchangeModel = (new ExchangeModel);
//         // 0||console.log( '$that.attr(),', $that.data('id'), $that );
//         var $id = $that.data('id');
//         $ExchangeModel.getExchange({id: $id}).then(result =>
//         {
//             if( result.code < 0 )
//             {
//                 messageBox({message: result.message, title: 'Warning', type: AlertBox.TYPE_WARN});
//             }
//             else
//             {
//                 // 0||console.debug( 'result.fullname', result );
//                 $IndexView.renderEditForm({data: result.data, name: $that.data('name')}, function(event)
//                 {
//                     var form = $(event.target).closest('form');
//                     // 0||console.log( 'event.target.closest()', event.target, form );
//                     var ret = self.FormChecker.FormSubmit({ event: e,
//                         form: form,
//                         justReturn: 1,
//                         beforeSubmit: (props) => $IndexView.beginSave(props),
//                         onError: [
//                             (props) => $IndexView.setErrorOnField(props, 0),
//                             (props) => $IndexView.setErrorOnField(props, 1),
//                         ],
//                     });
//
//                     if( ret )
//                     {
//                         var formData = new FormData(<HTMLFormElement>form[0]);
//                         formData.set('Exchange', $id);
// // 0||console.log( 'form', form, formData.get('HomeName'), formData.get('Exchange') );
//                         $ExchangeModel.saveEditExchange({data: formData}).then(result =>
//                         {
//                             0||console.log( 'result', result );
//                             $IndexView.setEditSuccess({...result, ...result.data});
//                             // window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
//                             // location.href = result.url;
//                         },
//                         result => {
//                             0||console.log( 'result', result );
//                             $IndexView.setErrors({form: form, ...result, noScroll: true});
//                             $IndexView.endEditExch();
//                         });
//
//                     } else {
//                         $IndexView.endEditExch();
//                     } // endif
//
//                     return false;
//                 });
//             } // endif
//         },
//         result => {
//             messageBox({message: result.message, title: 'Warning', type: AlertBox.TYPE_WARN});
//         });
    }
}
