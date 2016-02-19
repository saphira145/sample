(function($, document, window) {


	var ManageLogic = {
		init: function(options, element) {
			var self = this;

			self.element = element;
			self.$element = $(element)

			self.options = $.extend({}, $.fn.ManageTable.options, options);

			// Build manage table
			this.buildManageTable();

			// Bind event
			this.bindEvent();
			
		},

		buildManageTable: function() {
			var self = this;
			self.Table = $(self.options.wrapperClass).find(self.options.tableClass).DataTable({
				serverSide: true,
				processing: true,
				ajax: {
					url: self.options.ajaxRequest.getList,
					type: 'POST',
				},
				columns : self.options.table.columns,
			    columnDefs : self.options.table.columnDefs
		    });
		},

		bindEvent: function() {
			var self = this;

			$('body').on('click', self.options.wrapperClass + ' ' + self.options.action.createModalButton, {self: self}, self.openCreateModal);
			$('body').on('click', self.options.wrapperClass + ' ' + self.options.action.editModalButton, {self: self}, self.openEditModal);
			$('body').on('click', self.options.wrapperClass + ' ' + self.options.action.viewModalButton, {self: self}, self.openViewModal);
			$('body').on('click', self.options.wrapperClass + ' ' + self.options.action.deleteModalButton, {self: self}, self.openDeleteModal);


			$('body').on('click', self.options.modal.createModal + ' #save', {self: self}, self.saveProcess)
			$('body').on('click', self.options.modal.editModal + ' #update', {self: self}, self.updateProcess)
			// $('body').on('click', self.options.modal.vieweModal + ' #save', {self: self}, self.viewProcess)
			$('body').on('click', self.options.modal.createModal + ' #delete', {self: self}, self.deleteProcess)
		},

		// Open create modal
		openCreateModal: function(e) {
			var self = e.data.self
			var form = $(self.options.modal.createModal).find('.create-form');
			// Show modal
			$(self.options.modal.createModal).modal('show');
			// Clear all error and input value
			self._clearUpForm(form);
		},

		// Open edit modal
		openEditModal: function(e) {
			var self = e.data.self;
			var id = $(this).attr('id');
			var form = $(self.options.modal.editModal).find('.edit-form');

			$(self.options.modal.editModal).modal('show');

			$.ajax({
				url: self.options.ajaxRequest.edit,
				type: 'POST',
				data : {
					id: id
				},
				beforeSend: function() {
					$(self.options.modal.editModal).find('.modal-content').addClass('ajax-load');
					self._clearUpForm(form);
				},
				success: function(res) {

					if (res.status === 1) {

						if (res.hasOwnProperty('record')) {
							self._fillUpRecord(res.record, form);
						}

						if (res.hasOwnProperty('extraData')) {
							self._fillUpExtraData(res.extraData, form);
						}
					}

					if (res.status === 0) {
						
					}
				},
				complete: function() {
					$(self.options.modal.editModal).find('.modal-content').removeClass('ajax-load');	

				},
				error: function() {
					$(self.options.modal.editModal).modal('hide');			
					// Show message		
				}
			})
		},

		// Open create modal
		openViewModal: function(e) {
			var self = e.data.self
			$(self.options.modal.viewModal).modal('show');
		},

		// Open create modal
		openDeleteModal: function(e) {
			var self = e.data.self
			$(self.options.modal.deleteModal).modal('show');
		},

		// Send ajax save object
		saveProcess: function(e) {
			var self = e.data.self;
			var form = $(self.options.modal.createModal).find('.create-form'); 
			
			$.ajax({
				url: self.options.ajaxRequest.save,
				type: 'POST',
				data: form.serialize(),
				beforeSend: function() {
					$(self.options.modal.createModal).find('.modal-content').addClass('ajax-load');
				},
				success: function(res) {
					// Clear all error
					form.find(".error-msg").text('');

					if (res.status === 1) {
						$(self.options.modal.createModal).modal('hide');
						self.Table.ajax.reload(null, false);
					}

					if (res.status === 0) {
						if (res.hasOwnProperty('errors')) {
							var errors = res.errors
							for (var key in errors) {
								form.find("." + key + '-error').text(errors[key][0].message);
							}
						}

						if (res.hasOwnProperty('message')) {
							$(self.options.modal.createModal).modal('hide');
							// Show message

						}
						// Focus input error
						self._focusErrorInput(form);
						
					}
				},
				complete: function() {
					$(self.options.modal.createModal).find('.modal-content').removeClass('ajax-load');	
				},
				error: function() {
					$(self.options.modal.createModal).modal('hide');
				}
			})
		},

		// Send ajax update object
		updateProcess: function(e) {
			var self = e.data.self;
			var form = $(self.options.modal.editModal).find('.edit-form'); 
			
			$.ajax({
				url: self.options.ajaxRequest.update,
				type: 'POST',
				data: form.serialize(),
				beforeSend: function() {
					$(self.options.modal.editModal).find('.modal-content').addClass('ajax-load');
				},
				success: function(res) {
					// Clear all error
					form.find(".error-msg").text('');

					if (res.status === 1) {
						$(self.options.modal.editModal).modal('hide');
						self.Table.ajax.reload(null, false);
					}

					if (res.status === 0) {
						if (res.hasOwnProperty('errors')) {
							var errors = res.errors
							for (var key in errors) {
								form.find("." + key + '-error').text(errors[key][0].message);
							}
						}

						if (res.hasOwnProperty('message')) {
							$(self.options.modal.editModal).modal('hide');
							// Show message

						}
						// Focus input error
						self._focusErrorInput(form);
						
					}
				},
				complete: function() {
					$(self.options.modal.editModal).find('.modal-content').removeClass('ajax-load');	

				}
			})
		},

		// Send ajax view object
		viewProcess: function() {

		},

		// Send ajax delete object
		deleteProcess: function() {

		},
		_clearUpForm: function(form) {
			
			form.find('.error-msg').text('');
			form.find('input[type=text]').val('');
			form.find('textarea').text('');
			form.find('select').each(function() {
				$(this).val($(this).find("option:first").val());
			});
			form.find('input[type=radio]').each(function() {
				$(this).attr('checked', false);
			});
		},
		_focusErrorInput: function(form) {
			form.find("input.required").each(function() {
				if ($(this).val().trim() === '') {
					$(this).focus();
					return false;
				}
			})
		},

		_fillUpRecord: function(record, form) {
			$.each(record, function(key, value) {
				var selectEle = form.find('[name=' + key + ']');
				
				switch(selectEle.prop('nodeName')) {
					case 'INPUT':
						if (selectEle.attr('type') == 'text' || selectEle.attr('type') == 'hidden') {
							selectEle.val(value);
						} 

						if (selectEle.attr('type') == 'radio') {
							selectEle.each(function() {
								if ($(this).val() == value) {
									$(this).prop("checked", 'checked');
								}
							})
						}
						break;
					case 'TEXTAREA':
						selectEle.text(value);
						break;
					case 'SELECT' :
						selectEle.val(value);
						break;
					case 'undefined':
					default:
						return true;
				}
				
				if (key === 'image') {
					$(".image-preview").css({'background-image': 'url('+ value +')'});
				}
			})
		},

		_fillUpExtraData: function(data, form) {

		}

	}


	$.fn.ManageTable = function(options) {

		return this.each(function() {
			var manageLogic = Object.create(ManageLogic)
			manageLogic.init(options, this);
			
		})
	}	

	$.fn.ManageTable.options = {
		wrapperClass: '.wrapper-table',
		object: 'object',
		ajaxRequest: {
			getList: 	'/getList',
			save: 		'/save',
			edit: 		'/edit',
			update: 	'/update',
			delete: 	'/delete',
			view: 		'/view',
			upload: 	'/media/upload'
		},
		table: {
            columns: [
                {'data' : 'first_name'},
                {'data' : 'last_name'},
                {'data' : 'email'},
                {'data' : 'image'},
                {'data' : 'birthday'},
                {'data' : 'id'},
            ],
            columnDefs : [
                {
                    targets: -1,
                    orderable: false,
                    render: function(id) {
                        var template = 
                            '<div>'
                                +'<a href="javascript:void(0)" class="'+ self.options.action.viewModalButton +' action"  id="'+ id +'">View</a>'
                                +'\n'
                                +'<a href="javascript:void(0)" class="'+ self.options.action.editModalButton +' action"  id="'+ id +'">Edit</a>'
                                +'\n'
                                +'<a href="javascript:void(0)" class="'+ self.options.action.deleteModalButton +' action" id="'+ id +'">Delete</a>'
                            +'</div>'

                        return template;
                    }
                }
            ]
        },
	    modal: {
	    	createModal: '#create-modal',
	    	editModal: '#edit-modal',
	    	deleteModal: '#delete-modal',
	    	viewModal: '#view-modal',
	    },
	    action: {
	    	createModalButton : '.create-modal-button',
	    	editModalButton : '.edit-modal-button',
	    	viewModalButton : '.view-modal-button',
	    	deleteModalButton : '.delete-modal-button',
	    },
		dateFormat: 'YYYY-MM-DD',
		uploadClass: 'upload'
	}

})(jQuery, document, window);