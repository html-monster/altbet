import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react' ;

import BaseController from './BaseController';
import Actions from '../actions/GidxVerificationActions.ts';
import {Framework} from '../common/Framework.ts';


class GidxVerification extends BaseController
{
    /**@private*/ uploadForm;
    /**@private*/ uploadButton;


    constructor(props)
    {
        super(props);
        0||console.log( 'GidxVerification', this.props );

        // ABpp.controllers.EventPage

        // this.state = {data: props.data};
        __DEV__&&console.debug( 'GidxVerification props', props );

        // this.actions = props.eventPageActions;
    }


    render()
    {
        const { actions, data: {files, loadError, loadProgress} } = this.props;
        var self = this;

        return <div className="wrapper">
            <form ref={(itm) => this.uploadForm = itm} action={`${ABpp.baseUrl}/Account/UploadImage`} encType="multipart/form-data" className="document_upload" >
                <h3 className="section_user">Your files</h3>
                <hr/>
                <div className="miniatures">
                    {/* <div className="thumbnail">
                     <span className="close" title="Remove this file"><span>{}</span></span>
                     <a href="#" target="_blank">
                     <img src="Images/event_page_chart_b.jpg" alt=""/>
                     <span className="link link_text">Some.jpg</span>
                     </a>
                     </div>
                     <div className="thumbnail">
                     <span className="close" title="Remove this file"><span>{}</span></span>
                     <a href="#" target="_blank">
                     <img src="Images/curacao_logo.png" alt=""/>
                     <span className="link link_text">Some.png</span>
                     </a>
                     </div>
                     <div className="thumbnail doc">
                     <span className="close" title="Remove this file"><span>{}</span></span>
                     <a href="#" target="_blank">
                     <span className="thumb_icon txt">{}</span>
                     <span className="link link_text">Some.txt</span>
                     </a>
                     </div>
                     <div className="thumbnail doc">
                     <span className="close" title="Remove this file"><span>{}</span></span>
                     <a href="#" target="_blank">
                     <span className="thumb_icon doc">{}</span>
                     <span className="link link_text">Some.doc</span>
                     </a>
                     </div>
                     <div className="thumbnail doc">
                     <span className="close" title="Remove this file"><span>{}</span></span>
                     <a href="#" target="_blank">
                     <span className="thumb_icon xls">{}</span>
                     <span className="link link_text">Some.xls</span>
                     </a>
                     </div>*/}
                    {
                        files.length ?
                            files.map((item, index) =>
                            {
                                const extension = item.ContentType.split('/');
                                if(item.ContentType !== 'load'){
                                    var name = item.Name.split('.');
                                    name = /[\wа-яА-Я]{18}/gi.test(name[0]) ? `${name[0].slice(0, 18)}...${name[1]}` : item.Name;
                                }
                                return item.ContentType !== 'load' ?
                                    <div className={`thumbnail file ${extension[0] === 'image' ? '' : 'doc'}`} key={index} title={name}>
                                        <button className="close" title="Remove this file"
                                              onClick={actions.ajaxDeleteFile.bind(null, item.Name)}><span>{}</span></button>
                                        <a href={item.Url} target="_blank">
                                            {
                                                extension[0] === 'image' ?
                                                    <img src={item.Url} alt={name}/>
                                                    :
                                                    <span className={`thumb_icon ${extension[1]}`}>{}</span>
                                            }
                                            <span className="link link_text">{}</span>
                                        </a>
                                    </div>
                                :
                                <div className="thumbnail loading" key={index}>
                                    {/*<span className="close" title="Cancel loading"><span>{}</span></span>*/}
                                    <div className="progress_wrp">
                                        <div className="progress_bar" style={{width: loadProgress + '%'}}>{}</div>
                                        <div className="status">{loadProgress}%</div>
                                    </div>
                                </div>
                            })
                            :
                            <p>Add your documents files</p>
                    }
                </div>
                <button ref={(itm) => this.uploadButton = itm} className="btn btn_green wave upload load_btn left" onClick={this._loadFile}>Load file</button>
                <input type="file" name="file" accept=".png,.jpeg,.jpg"
                       //.doc,.docx,.xls,.xlsx,.txt,
                       onChange={actions.actionOnFileChosen.bind(null, this)}
                       style={{visibility: 'hidden'}} />
                <span className={'answer_message' + (loadError && ' validation-summary-errors')} style={{height: 22}}>
                    {loadError}
                </span>
            </form>
        </div>
    }


    /**
     * Start loading dialog
     * @param event
     * @private
     */
    _loadFile(event)
    {
		event.preventDefault();
		event.target.nextSibling.click();
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default () => connect(state => ({
    data: state.gidxVerification,
    // test: state.Ttest,
}),
dispatch => ({
	actions: bindActionCreators(Framework.initAction(Actions), dispatch),
})
)(GidxVerification)