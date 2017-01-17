/**
 * Created by Htmlbook on 16.01.2017.
 */
export const mailValidation = (value) => {
	let errors;
	// console.log(value);

	if (!value)
		errors = 'Required';
	else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
		errors = 'Invalid email address';

	return errors
};

