
var Authenticate = (function() {

	var registerForm = $('.register-form');


	registerForm.ajaxForm({
		beforeSend: function() {
			registerForm.closest('.panel').addClass('ajax-load');
		},
		success: function(res) {
			// Clear error
			_clearError(registerForm);

			if (res.status === 1) {

			}

			if (res.status === 0) {
				if (res.hasOwnProperty('redirect') ) {
					window.location.replace(res.redirect);
				}

				if (res.hasOwnProperty('errors')) {
					var errors = res.errors;
					for (var key in errors) {
						var ele = registerForm.find('.error-'+ key);
						ele.text(errors[key][0].message);
						ele.closest('.form-group').addClass('has-error');
					}
					_focusErrorInput(registerForm);
					return false;
				}
			}
		},
		complete: function() {
			registerForm.closest('.panel').removeClass('ajax-load');
		}
	});

	function _focusErrorInput (form) {
		form.find(".has-error").find('input').each(function () {
            $(this).focus();
            return false;
	    });
	}
	function _clearError(form) {
		form.find('.form-group').removeClass('has-error');
		form.find(".error").text('');
	}

})();