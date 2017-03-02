/**
 * Created by Htmlbook on 16.01.2017.
 */
export const mailValidation = (value) => {
	let errors;

	if (!value)
		errors = 'Required';
	else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
		errors = 'Invalid email address';

	return errors
};

export const emptyValidation = (value) => {
	let errors;

	if (!value)
		errors = 'Required';

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


export const maxLengthValidation = (inOpts, inValue) =>
{
	let errors;
	let value;
	let opts = {
        size: 20,
	};

    // user opts
	if( inValue ) opts = {...opts, ...inOpts};
	value = inValue || inOpts;

	if (value.length > opts.size)
		errors = 'Max length is ' + opts.size;

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





