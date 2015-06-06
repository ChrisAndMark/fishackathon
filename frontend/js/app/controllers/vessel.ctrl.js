(function(angular) {
	angular.module('SeaScape')
		.controller('VesselController', controller);
		
	controller.$inject = ['$log', '$state', 'UserService', 'VesselService'];
	function controller($log, $state, UserService, VesselService) {
		var vm = this;
		
		vm.submit = submit;
		vm.vessel = {
			vname: 'Big boat',
			vstateregno: '102',
			vcommercialno: '102',
			fisheryIdNo: '105'
		}	
		
		function submit() {
			VesselService.add(vm.vessel)
				.then(function() {
					UserService.addVessel(vm.vessel);
					$state.go('logged.account');				
				});
		}
	}
})(angular);