(function(angular) {
	angular.module('SeaScape')
		.controller('RegisterController', controller);
		
	controller.$inject = ['$log', '$state', 'AuthService'];
	function controller($log, $state, AuthService) {
		var vm = this;
		
		vm.submit = submit;
		
		// TEST DATA
		vm.user = {
			email: 'mniehe@gmail.com',
			pass: 'password',
			fname: 'mark',
			lname: 'niehe',
			address: '123 james st',
			city: 'jameston',
			state: 'Cali',
			zip: '90210'
		}
		
		function submit() {
			// Perform validation first
			AuthService.register(vm.user)
				.then(function() {
					$log.debug('User Created!');
					$state.go('notLogged.login');
				});
		}
	}
})(angular);