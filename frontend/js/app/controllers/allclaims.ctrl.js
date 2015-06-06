(function(angular) {
	angular.module('SeaScape')
		.controller('AllClaimsController', controller);
		
		
	function controller() {
		var vm = this;
		
		vm.claims = [{
			vessel: 'vessel 1',
			dateTime: new Date(),
			location: ['49.2827° N', '123.1207° W'],
			interaction: 'incidental',
			species: [{
				specieCode: 22,
				mortalityCode: 1,
				amount: 43
			}],
			unknownDesc: 'loch ness bro'
		}];
		
		
		
	}
})(angular);