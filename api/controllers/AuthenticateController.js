/**
 * AuthenicateController
 *
 * @description :: Server-side logic for managing authenicates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getLogin: function(req, res) {
		res.locals.layout = 'loginLayout';
		return res.view('authenticate/login');
	}
};

