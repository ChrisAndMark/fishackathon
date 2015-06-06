(function(angular) {
	angular.module('SeaScape')
		.controller('AccountController', controller);
		
	controller.$inject = ['$log', '$state', 'UserService'];
	function controller($log, $state, UserService) {
		var vm = this;
		
		vm.user = UserService.getUser();
		vm.addVessel = addVessel;
		
		function addVessel() {
			$state.go('logged.addVessel');
		}
	}
})(angular);