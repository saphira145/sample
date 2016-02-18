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
			var Table = $(self.options.wrapperClass).find(self.options.tableClass).DataTable({
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
			$('body').on('click', self.options.modal.vieweModal + ' #save', {self: self}, self.viewProcess)
			$('body').on('click', self.options.modal.createModal + ' #save', {self: self}, self.deleteProcess)
		},

		// Open create modal
		openCreateModal: function(e) {
			var self = e.data.self
			$(self.options.modal.createModal).modal('show');
		},

		// Open create modal
		openEditModal: function(e) {
			var self = e.data.self
			$(self.options.modal.editModal).modal('show');
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
			console.log($(self.options.createModal).find('.create-form').serialize())
			$.ajax({
				url: self.options.ajaxRequest.save,
				type: 'POST',
				data: $(self.options.createModal).find('.create-form').serialize(),
				beforeSend: function() {
					$(self.options.createModal).addClass('ajax-load');
				},
				success: function(res) {

				},
				complete: function() {
					$(self.options.createModal).removeClass('ajax-load');	
				}
			})
		},

		// Send ajax update object
		updateProcess: function() {

		},

		// Send ajax view object
		viewProcess: function() {

		},

		// Send ajax delete object
		deleteProcess: function() {

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