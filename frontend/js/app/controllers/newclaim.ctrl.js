(function(angular) {
	angular.module('SeaScape')
		.controller('NewClaimController', controller);
				
  controller.$inject = ['ClaimService'];
	function controller(ClaimService) {
		var vm = this;

    vm.claim = {
      vesselID: '557f9f83ef0bf0613415d2e8',
      fishingGear: 'rode',
      targetSpecies: 'blue whales',
      dateTime: new Date(),
      longtitude: '-123.086700',
      latitude: '49.321402',
      notes: 'They died',
      type: 'intentional'
    };

    vm.addClaim = addClaim;

    function addClaim() {
      ClaimService.add(vm.claim)
        .then(function() {
          console.log('added');
        });
    }
	}
})(angular);