/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Q = require('q');

module.exports = {

	index: function(req, res) {
		return res.view();
	},

	getStudentList: function(req, res) {
		var data = req.params.all();
		var sortOrder = {'column': data.order[0].column, 'dir': data.order[0].dir};
		var offset = data.start;
		var limit = data.length;
		var search = data.search.value;
		var draw = req.param('draw');
		var config = sails.config.mainConfig;

		var customWhere;

		Q.all([
			Student.getStudentList(sortOrder, offset, limit, search, customWhere),
			Student.getTotalRecords(search, customWhere)
		])
		.spread(function (students, totalRecords) {

			return res.json({data: students, recordsTotal: totalRecords, recordsFiltered: totalRecords, draw: draw});
		})
		.catch(function(err) {
			console.log(err);
		})
	},

	saveStudent: function(req, res) {
		var params = req.params.all();
		Student.create({
			first_name: params.first_name.trim(),
			last_name: params.last_name.trim(), 
			birthday: params.birthday, 
			gender: params.gender,
			email: params.email,
			image: params.image,
			status: params.status
		})
		.then(function(student){
			return res.json({status: 1, message: 'Save student successfully'});
		})	
		.catch(function(err) {
			if (err.ValidationError) {
				var errorBag = Helper.validate(err.ValidationError, Student.validationMessages);
				return res.json({status: 0, errors: errorBag});
			}
			return res.json({status: 0, message: 'Server Error'});
		})
	},
	editStudent: function(req, res) {
		var params = req.params.all();
		var status = ['Active', 'Deactive'];

		Student.findOne({id: params.id})
			.then(function(student) {
				return res.json({status: 1, record: student, extraData : {status: status}})
			})
			.catch(function() {

			})
	}
};

