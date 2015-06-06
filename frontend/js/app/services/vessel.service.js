(function(angular) {
	angular.module('SeaScape')
		.service('VesselService', service);
		
	service.$inject = ['$q', 'ApiService'];
	function service($q, ApiService) {
		this.add = add;
		
		function add(vessel) {
			var deferred = $q.defer();
			var data = {
				vessel_name: vessel.vname,
				vessel_registry_num: vessel.vstateregno,
				vessel_comm_num: vessel.vcommercialno,
				fisher_id_number: vessel.fisheryIdNo
			};
			
			ApiService.post('vessel', data)
				.success(function(data) {
					deferred.resolve();
				})
				.error(function(data, status, headers, config) {
					deferred.reject();
				});	
			
			return deferred.promise;				
		}
	}
})(angular);