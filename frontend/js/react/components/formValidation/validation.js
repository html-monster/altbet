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




