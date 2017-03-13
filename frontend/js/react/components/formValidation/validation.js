/**
 * Created by Htmlbook on 16.01.2017.
 */

export const emptyValidation = (value) => {

	return errors
};

export const minLengthValidation = (minLength, value) => {
	let errors;

	if (value.length <= minLength)
		errors = `Min length ${minLength} symbols`;

	return errors
};

export const maxLengthValidation = (maxLength, value) => {
	let errors;

	if (value.length > maxLength)
		errors = `Max length ${maxLength} symbols`;

	return errors
};

export const lettersOnlyValidation = (value) => {
	let errors;

	if (!/^[a-zA-Z]+$/i.test(value))
		errors = 'Use latin letters only please';

	return errors
};

export const extendLettersOnlyValidation = (value) => {
	let errors;

	if (!/^[a-zA-Zа-яА-Я-]+$/i.test(value))
		errors = 'Use latin letters only please';

	return errors
};

export const checkOnSpecialSymbolsValidation = (value) => {
	let errors;

	if (!/^[a-zA-Z.,-/'`()\d\s]+$/i.test(value))
		errors = 'Not available special symbols like @#$%^~ etc.';

	return errors
};

export const adressValidation = (value) => {
	let errors;

	if (!/^[a-zA-Zа-яА-Я.,-/\d\s]+$/i.test(value))
		errors = 'Invalid email address';

	return errors
};


export const mailValidation = (value) => {
	let errors;

	if (!value)
		errors = 'Required';
	else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
		errors = 'Invalid email address';

	return errors
};

export const phoneValidation = (value) => {
	let errors;

	if (!/^[+(\d][\d\s()-.]{3,20}$/i.test(value))
		errors = 'Invalid phone number';

	return errors
};


export const minLengthValidation = (inOpts, inValue) =>
{
	let errors;
	let value;
	let opts = {
        size: 6,
	};

    // user opts
	if( inValue ) opts = {...opts, ...inOpts};
	value = inValue || inOpts;

	if (value.length < opts.size)
		errors = 'Min length is ' + opts.size;

	return errors
};


export const lengthValidation = (inOpts, inValue) =>
{
	let errors;
	let value;
	let opts = {
        min: 0,
        max: 20,
	};

    // user opts
    if (!inOpts.max) inOpts.max = false;
	if( inValue ) opts = {...opts, ...inOpts};
	value = inValue || inOpts;

	if (opts.max && value.length > opts.max)
		errors = 'Max length is ' + opts.max;
	if (value.length < opts.min)
		errors = 'Min length is ' + opts.min;

	return errors
};


export const regexValidation = (inOpts, inValue) =>
{
	let errors;
	let value;
	let opts = {
        tmpl: /.*/,
        message: "All symbols are allowed",
	};

    // user opts
	if( inValue ) opts = {...opts, ...inOpts};
	value = inValue || inOpts;
    if (!opts.tmpl.test(value))
		errors = opts.message;

	return errors
};


export const passwordValidation = (inRef, value) =>
{
	let errors;

    var elm = document.getElementById(inRef);
    if( elm && elm.value != value ) errors = "Password do not match";

	return errors
};



export const netellerSecureId = (value) => {
	let errors;

	if (value.length != 6)
		errors = 'Secure ID must be 6 digits';

	return errors
};

export const orderForm = function (context) {

	if($(context).find('[data-log-out]').attr('data-log-out')) return false;

	let price = +$(context).find('.price input').val(),
		volume = +$(context).find('.volume input').val(),
		sum = +$(context).find('.obligations input').val(),
		checkboxProp = $(context).find('input[type="checkbox"]').length ? $(context).find('input[type="checkbox"]').prop('checked') : 1;

	if(!ABpp.User.userIdentity){
		$('.sign_in_form').fadeIn(200);  //'.sign_in_form'
		$('#login-email').focus(); //'#email'
		return false;
	}


	if(checkboxProp){
		if(0 >= price || price > 0.99){
			$(context).find('.price input').next().fadeIn(200);
			return false;
		}
		if(0 >= volume || !(defaultMethods.isInteger(volume))){//|| +volume > 999999
			$(context).find('.volume input').next().fadeIn(200);
			return false;
		}
		if(0 >= sum){// || +sum > 999999
			$(context).find('.obligations input').next().fadeIn(200);
			return false;
		}
	}
	else{
		if((0 >= volume || !(defaultMethods.isInteger(volume))) && sum == ''){//|| +volume > 999999
			$(context).find('.volume input').next().fadeIn(200);
			return false;
		}
		if(0 >= sum && volume == ''){// || +sum > 999999
			$(context).find('.obligations input').next().fadeIn(200);
			return false;
		}
	}

	return true;
};





