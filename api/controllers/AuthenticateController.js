/**
 * AuthenicateController
 *
 * @description :: Server-side logic for managing authenicates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res) {
		res.locals.layout = 'loginLayout';
		return res.view();
	}
};

