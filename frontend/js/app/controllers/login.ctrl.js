(function(angular) {
	angular.module('SeaScape')
		.controller('LoginController', controller);
		
	controller.$inject = ['$log', '$state', 'AuthService']
	function controller($log, $state, AuthService) {
		var vm = this;
		
		vm.email = 'mniehe@gmail.com';
		vm.pass  = 'password';
		vm.submit = submit;
		
		function submit() {
			AuthService.login(vm.email, vm.pass)
				.then(function() {
					$log.debug('User logged in. Getting details.');
					
					AuthService.getUser();
					
					$state.go('logged.allClaims');
				});
		}
	}
})(angular);