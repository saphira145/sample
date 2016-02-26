/**
* Student.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var Q = require('q');

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
        gender: {
            type: 'integer',
            required: true
        },
		email: {
			type: 'email',
            required: true
		},
        password: {
            type: 'string',
            required: true
        },
		image: {
			type: 'string',
            // required: true
		},
		birthday: {
			type: 'datetime',
			// required: true	
		},
        status: {
            type: 'integer',
            required: true
        }	
	},
    validationMessages: {
        first_name: {
            required: 'Fist name is required'
        },
        last_name: {
            required: 'Last name is required'
        },
        email: {
            required: 'Email is required',
            email: 'Must be email format'
        },
        gender :{
            required: 'Must choose gender',
            integer: 'Must choose gender'
        },
        birthday: {
            required: 'Birthday is required',
            datetime: 'Must be is date type'
        },
        status: {
            integer: 'Status is required',
            required: 'Status is required'
        },
        password: {
            required: 'Password is required'
        },
    },

	getStudentList: function(sortOrder, offset, limit, search, customWhere) {

		var column = Student.getColumn();
        var query = {
                skip: offset,
                limit: limit,
            }

        if (sortOrder.hasOwnProperty('column') && sortOrder.hasOwnProperty('dir')) {
            query.sort = column[sortOrder.column] + ' ' + sortOrder.dir;
        }

        if (search.trim() != '') {
            query.where = {
                'or': [{
                            first_name: {'like' : '%' + search + '%'}
                        },
                        {
                            last_name: {'like' : '%' + search + '%'}
                    	},
                        {
                            email: {'like' : '%' + search + '%'}
                    	},
                        {
                            birthday: {'like' : '%' + search + '%'}
                    	}
                    ]
            };
        }
        if (customWhere) {
            return this.find(query).where(customWhere);    
        }
        
        return this.find(query);
	},

    getTotalRecords: function(search, customWhere) {
        var query = {};

        if (search.trim() != '') {
            query.where = {
                'or': [{
                            first_name: {'like' : '%' + search + '%'}
                        },
                        {
                            last_name: {'like' : '%' + search + '%'}
                    	},
                        {
                            email: {'like' : '%' + search + '%'}
                    	},
                        {
                            birthday: {'like' : '%' + search + '%'}
                    	}
                    ]
            };
        }
        var Promise = Q.promise(function(resolve, reject) {
            Student.find(query).where(customWhere)
                .then(function(records) {
                    resolve(records.length);
                })
                .catch(function(err) {
                    reject(err);
                })
        });

        return Promise;
    },
    getColumn: function() {
        return ['first_name', 'last_name', 'email', 'image', 'birthday'];
    },
    beforeCreate: function(student, next) {
        var errors = {};

        Student.checkEmailUnique(student.email)
            .then(function(result) {    
                if (result) {
                    errors.validate = {email: [{rule: 'unique', message: 'Email already exists'}] };
                    next(errors);
                }
                next();
            })
            .catch(function(err) {
                next(err);
            })
    },
    checkEmailUnique: function(email, idCheck) {
        var Promise = Q.promise(function(resolve, reject) {
            if (idCheck) {
                Student.findOne({email: email, id: {'!' : idCheck} })
                    .then(function(student) {   
                        (student) ? resolve(true): resolve(false);
                    })
                    .catch(function(err) {
                        reject(err);
                    })
            }

            if (!idCheck) {
                Student.findOne({email: email})
                    .then(function(student) {

                        (student) ? resolve(true): resolve(false);
                    })
                    .catch(function(err) {
                        reject(err)
                    })
            }
        })

        return Promise;
    }
};

