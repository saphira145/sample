/**
* Student.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		id: {
			type: 'integer',
			autoIncrement: true,
			primaryKey: true,
		},
		first_name: {
			type: 'string',
			required: true
		},
		last_name: {
			type: 'string',
			required: true
		},
		email: {
			type: 'string',
			email: true
		},
		image: {
			type: 'string',
			required: true
		}		
	}
};

