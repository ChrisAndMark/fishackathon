(function(angular) {
	angular.module('SeaSharp', [
		'ui.router'	
	]);
	
	routing.$inject = ['$stateProvider', '$urlRouterProvider'];
	function routing($stateProvider, $urlRouterProvider) {
        var home = {
                url: '/',
                abstract: true,
                views: {
                    "nav": { 
                        templateUrl: 'nav.html'
                    },
                    "main": {
                        template: '<ui-view/>'
                    }
                }
            },
            index = {
                url: '',
                templateUrl: 'index.html',
                controller: 'HomeCtrl as home'
            },
            about = {
                url: 'about',
                templateUrl: 'about.html',
                controller: 'AboutCtrl as about'
            },
            contact = {
                url: 'contact',
                templateUrl: 'contact.html',
                controller: 'ContactController as contact',
                title: 'Contact us'
            },
            dropin = {
                url: 'dropin',
                templateUrl: 'dropin.html',
                controller: 'DropinController as dropin'
            };               
        
        // Define default route
        $urlRouterProvider.otherwise("/");
        
        $stateProvider
            .state('home', home)
            .state('home.index', index)
            .state('home.contact', contact)
            .state('home.dropin', dropin)
            .state('home.about', about);	
	}
})(angular)