(function(angular) {
	angular.module('SeaScape')
		.config(authInterceptor)
		.factory('AuthInterceptor', intercept)
		.service('AuthService', service);
		
	service.$inject = ['$q', 'ApiService', 'UserService'];
	function service($q, ApiService, UserService) {
		this.login    = login;
		this.register = register;
		this.getUser  = getUser;
		
		function login(email, pass) {
			var deferred = $q.defer();
			
			ApiService.post('login', {
				username: email,
				pass: pass
			})
				.success(function(data, status, headers, config) {
					UserService.setToken(data);
					deferred.resolve();
				})
				.error(function(data, status, headers, config) {
					deferred.reject();
				});
			
			return deferred.promise;
		}
		
		function register(user) {
			var deferred = $q.defer();
			
			ApiService.post('user', {
				email: user.email,
				password: user.pass,
				first_name: user.fname,
				last_name: user.lname,
				addr: user.address,
				city: user.city,
				state: user.state,
				zip: user.zip
			})
				.success(function(data) {
					deferred.resolve();
				})
				.error(function(data, status, headers, config) {
					deferred.reject();
				});		
				
			return deferred.promise;	
		}
		
		function getUser() {
			var deferred = $q.defer();
			
			ApiService.get('user')
				.success(function(data) {
					UserService.login(data);
					deferred.resolve();
				})
				.error(function(data, status, headers, config) {
					deferred.reject();
				});
				
			return deferred.promise;
		}
	}
	
  // Perform the minor set up for the app
  authInterceptor.$inject = ['$httpProvider'];
  function authInterceptor($httpProvider) {
    // Attach the auth interceptor
    $httpProvider.interceptors.push('AuthInterceptor');
  }

  intercept.$inject = ['$q', '$window', '$log', 'UserService'];
  function intercept($q, $window, $log, UserService) {
    return {
      request: function (config) {
        var token      = UserService.getToken();
        config.headers = config.headers || {};

        // If the user is requesting a view, do not attach the token
        if (!config.url.match(/^\/?api\//)) return config;

        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
          $log.debug('AuthInterceptor: Token added to', config.url);
        }

        return config;
      },
      
      responseError: function (rejection) {

        if (rejection.status === 401) {
          $log.error('AuthInterceptor 401: user has not been authenticated');
          UserService.setToken();
        }
        // Return the promise rejection.
        return $q.reject(rejection);
      }
    };
  }	
})(angular)