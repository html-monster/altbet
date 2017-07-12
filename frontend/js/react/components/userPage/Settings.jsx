/**
 * Created by tianna on 09.02.17.
 */

import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FormValidation from '../FormValidation';
import InputValidation from '../formValidation/InputValidation';
// import ChangePassword from './settings/ChangePassword';
import { emptyValidation, lengthValidation, lettersOnlyValidation,
    regexValidation, mailValidation, phoneValidation } from '../formValidation/validation';
import {DateLocalization} from '../../models/DateLocalization';
import settingsActions from '../../actions/userPage/settingsActions';


class Settings extends React.Component
{
    _loadFile(event)
    {
		event.preventDefault();
		event.target.nextSibling.click();
    }

    // onFileChosen(event)
    // {
    //     //limit size 4888995
    //     console.dir(event.target.files[0]);
    // }

    render()
    {
        const { actions, data: { header, active }, files, loadError, loadProgress } = this.props;
        const { Country, Address, Phone } = appData.pageAccountData.UserInfo;

		const inputRender = ({ id, className, info, label, filled, inputLabel, meta: { error, dirty }, ...input }) => {
			return  <span className={'input_animate input--yoshiko input--filled' + (filled ? ' input--filled' : '')}>
                        <input className={`input__field input__field--yoshiko ${className ? className : ''}
                         ${dirty && (error ? ' invalidJs' : ' validJs')}`} {...input}/>
                        <label className="input__label input__label--yoshiko" htmlFor={id}>
                            <span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
                        </label>
				        { dirty && error && <span className="validation-summary-errors">{error}</span> }
                        { info && <span className="info top"><i>{ info }</i></span> }
                    </span>
		};

		const formContent = ({ input, error, successMessage, userInfo:{ FirstName, LastName, UserName, DateOfBirth, Email,
            Country, Address, Phone }, handleSubmit }) => {
			return <form action={appData.pageAccountUserInfoUrl} className="setting_form" method="post"
                         noValidate="novalidate" onSubmit={handleSubmit}>
                    <h3 className="section_user">Personal info</h3>
                    <hr/>

                    <InputValidation renderContent={inputRender} id={'f_name'} name="FirstName"
                                     initialValue={FirstName} info="Your first name as specified in your passport"
                                     label={'First Name'} type={'text'} filled={FirstName}
                                     validate={[emptyValidation, lengthValidation.bind(null, {min: 2, max: 20}), lettersOnlyValidation]}
                                     input={input} maxLength="20"/>

                    <InputValidation renderContent={inputRender} id={'l_name'} name="LastName"
                                     initialValue={LastName} info="Your second name as specified in your passport"
                                     label={'Last Name'} type={'text'} filled={LastName}
                                     validate={[emptyValidation, lengthValidation.bind(null, {min: 2, max: 20}), lettersOnlyValidation]} input={input}
                                     maxLength="20"/>


                    <InputValidation renderContent={inputRender} id={'n_name'} name="UserName"
                                     initialValue={UserName}
                                     label={'User Name'} type={'text'} filled={UserName}
                                     validate={[emptyValidation, lengthValidation.bind(null, {min: 2, max: 20})]} input={input}
                                     maxLength="20"/>

                    <InputValidation renderContent={inputRender} id={'user_b_day'} name="DateOfBirth"
                                     className={'datePickerJs'}
                                     initialValue={(new DateLocalization()).fromSharp(DateOfBirth, 0).unixToLocalDate({format: "DD MMM Y"})}
                                     label={'Date of birth'} type={'text'} filled={true}
                                     validate={emptyValidation} input={input}/>


                    <h3 className="section_user">Contact Info</h3>
                    <hr/>

                    <InputValidation renderContent={inputRender} id={'e_name'} name="Email"
                                     initialValue={Email}
                                     info={`Specify your valid email. A message with registration
                                     confirmation will be sent at that address. Also that address
                                     will be used for communication with you`}
                                     label={'Email Address'} type={'email'} filled={Email}
                                     validate={[emptyValidation, mailValidation]} input={input}/>

                    <InputValidation renderContent={inputRender} id={'c_name'} name="Country"
                                     initialValue={Country} info="Indicate the country of your permanent residence"
                                     label={'Country'} type={'text'} filled={Country}
                                     validate={[emptyValidation, lengthValidation.bind(null, {min: 2, max: 128})]}
                                     input={input} maxLength="20"/>

                    <InputValidation renderContent={inputRender} id={'s_name'} name="Address"
                                     initialValue={Address} info="Enter address manually"
                                     label={'Address'} type={'text'} filled={Address}
                                     validate={[emptyValidation, lengthValidation.bind(null, {min: 2, max: 200}), regexValidation.bind(null, {tmpl: /^[a-zA-Z.,-/'`()\d\s]+$/, message: "Not available special symbols like @#$%^~ etc."})]} input={input}
                                     maxLength="200"/>

                    <InputValidation renderContent={inputRender} id={'t_number'} name="Phone"
                                     initialValue={Phone}
                                     label={'Phone'} type={'tel'} filled={Phone}
                                     validate={[emptyValidation, phoneValidation]} input={input}
                                     maxLength="20"/>

                    <span className="input_animate input--yoshiko submit_container">
                        <input type="submit" value="Submit" className="btn wave submit"/>
                        {/*<span className="answer_message"></span>*/}
                        <span className={'answer_message' + (error && ' validation-summary-errors')}>{error}</span>
						<span className={'answer_message' + (successMessage && ' validJs')}>{successMessage}</span>
                    </span>
            </form>
		};

        return <div className={"tab_item settings " + (active ? "active" : "")}>
            <h2>Settings</h2>
			{header}
            <div className="column">
                <FormValidation
                    data={this.props.data}
                    userInfo={appData.pageAccountData.UserInfo}
                    renderContent={formContent}
                    handleSubmit={actions.actionAjaxUserDataUpdate}
                    serverValidation={true}
                />

                <form action={`${ABpp.baseUrl}/Account/UploadImage`} encType="multipart/form-data" className="document_upload"
                ref="uploadForm" style={{marginTop: 25}}>
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
                                                  onClick={actions.ajaxDeleteFile.bind(null, this, item.Name)}><span>{}</span></button>
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
                    <button className="btn btn_green wave upload load_btn left" ref={'uploadButton'} onClick={this._loadFile}>Load file</button>
                    <input type="file" name="file" accept=".png,.jpeg,.jpg"
                           //.doc,.docx,.xls,.xlsx,.txt,
                           onChange={actions.onFileChosen.bind(null, this)}
                           style={{visibility: 'hidden'}}
                           ref="uploadData"/>
                    <span className={'answer_message' + (loadError && ' validation-summary-errors')} style={{height: 22}}>
                        {loadError}
                    </span>
                </form>
            </div>

            {/*<ChangePassword />*/}

        </div>;
    }
}

export default connect(
	state => ({
        ...state.accountSetting
	}),
	dispatch => ({
		actions: bindActionCreators(settingsActions, dispatch),
	})
)(Settings)