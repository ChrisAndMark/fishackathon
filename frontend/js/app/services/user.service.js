(function(angular) {
	angular.module('SeaScape')
		.service('UserService', service);
		
	var COOKIE = {
		NAME: 'sid',
		EXPIRY: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
	};
		
	service.$inject = ['$log', '$q', '$cookies'];
	function service($log, $q, $cookies) {
		this.login      = login;
		this.getUser    = getUser;
		this.setToken   = setToken;
		this.getToken   = getToken;
		this.getVessels = getVessels;
		this.addVessel  = addVessel;
		this.user       = {};
		
		function login(user) {
			console.log(user.vessels);
			
			this.user = {
				email: user.email,
				fname: user.fname,
				mname: user.mname,
				lname: user.lname,
				address: user.address,
				city: user.city,
				state: user.state,
				zip: user.zip,
				vessels: user.vessels
			};			
		}
		
		function getUser() {
			return this.user;
		}
		
		function getVessels() {
			return this.user.vessels;
		}
		
		function addVessel(vessel) {
			$log.debug('Adding vessel:', vessel);
			this.user.vessels.push(vessel);
			return this.user.vessels;
		}
		
		function setToken(token) {
			if (token === undefined) { 
				$cookies.remove(COOKIE.name);
				$log.debug('Token deleted.');
			} else {
				$cookies.put(COOKIE.NAME, token, { expires: COOKIE.EXPIRY });
				$log.debug('Token set:', token);
			}
		}
		
		function getToken() {
			return $cookies.get(COOKIE.NAME);
		}
	}
})(angular)