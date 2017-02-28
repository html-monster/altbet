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

export const minLengthValidation = (value) => {
	let errors;

	if (value.length <= 6)
		errors = 'Min length of ID is 6';

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





