/**
 * Created by Htmlbook on 10.01.2017.
 */
const validate = values => {
	const errors = {};
// console.log(values);
	if (!values.clientId)
		errors.clientId = 'Required';

	if (!values.secureId)
		errors.secureId = 'Required';
	else if(values.secureId.length != 6)
		errors.secureId = 'Secure ID must be 6 digits';

	return errors
};

export default validate
