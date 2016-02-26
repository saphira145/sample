/**
 * AuthenticateController
 *
 * @description :: Server-side logic for managing authenicates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var validator = require('validator');

module.exports = {
	getLogin: function(req, res) {
		res.locals.layout = 'loginLayout';
		return res.view('authenticate/login');
	},

	register: function(req, res) {
		res.locals.layout = 'loginLayout';
		return res.view('authenticate/register');
	},
	postRegister: function(req, res) {
		var params = req.params.all();
		try {
			var errorsBag = Authenticate.validator(params);
			if (Object.keys(errorsBag).length > 0) {
				return res.json({status: 0, errors: errorsBag});
			}
		} catch (err) {
			console.log(err)
			return res.json({status: 0, messsage: 'Server error'});
		}

		Student.create({
			first_name: params.first_name,
			last_name: params.last_name,
			email: params.email,
			password: params.password,
			gender: params.gender,
			status: 0
		})
		.then(function (student) {
			return res.json({status: 1, messsage: 'Register successfully'});
		})
		.catch(function (err) {

			if (err.toJSON().raw.hasOwnProperty('validate')) {
				return res.json({status: 0, errors: err.toJSON().raw.validate});
			}

			return res.json({status: 0, messsage: 'Server error'});
		})
	}
};

