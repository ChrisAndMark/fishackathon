(function(angular) {
	angular.module('SeaScape')
		.service('ApiService', service);
		
	var ROOT_URL = '/api/v1/';
		
	service.$inject = ['$q', '$log', '$http'];
	function service($q, $log, $http) {
		this.post = post;
		this.get  = getRequest;
		
		function post(route, data) {
			route = ROOT_URL + route;
			
			$log.debug('POST', route, ':', data);
			
			return $http.post(route, data)
		}
		
		function getRequest(route) {
			route = ROOT_URL + route;
			
			$log.debug('GET', route);
			
			return $http.get(route);
		}
	}
})(angular);