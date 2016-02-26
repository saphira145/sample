/**
* Authenticate.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var validator = require('validator');

module.exports = {

	attributes: {
		
	},

	validator: function(params) {
		var errorsBag = {};

		if (params.email == undefined || params.email.trim() === '') {
			Authenticate.pushError('email', errorsBag, {rule: 'required', message: 'Email is required'})
		}

		if (!validator.isEmail(params.email)) {
			Authenticate.pushError('email', errorsBag, {rule: 'required', message: 'Must be email format'})	
		}
	

		if (params.password == undefined || params.password.trim() === '') {
			Authenticate.pushError('password', errorsBag, {rule: 'required', message: 'Password is required'});
		}

		if (params.password_confirmation == undefined || params.password_confirmation.trim() === '') {
			Authenticate.pushError('password_confirmation', errorsBag, {rule: 'required', message: 'Password confirmation is required'});
		}

		if (params.password !== params.password_confirmation) {
			Authenticate.pushError('password_confirmation', errorsBag, {rule: 'password_confirmation', message: 'Password confirmation must be match to passowrd'})
		}

		if (params.first_name == undefined || params.first_name.trim() === '') {
			Authenticate.pushError('first_name', errorsBag, {rule: 'required', message: 'First name is required'})
		}

		if (params.last_name == undefined || params.last_name.trim() === '') {
			Authenticate.pushError('last_name', errorsBag, {rule: 'required', message: 'Last name is required'})
		}

		if (params.gender == undefined || params.gender === '') {
			Authenticate.pushError('gender', errorsBag, {rule: 'required', message: 'Gender is required'})	
		}

		return errorsBag;
	},

	pushError: function(key, errorsBag, error) {
		if (errorsBag.hasOwnProperty(key)) {
			errorsBag[key].push(error);
		} else {
			errorsBag[key] = [error]; 
		}

		return errorsBag;
	}

};

