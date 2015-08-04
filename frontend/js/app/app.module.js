(function(angular) {
  var BASE_TITLE = 'SeaScape';
  
  angular.module('SeaScape', [
    'ui.router',
    'ngCookies',
    'angular-loading-bar'
    ])
  .config(routing)
  .run(titleChange);
  
  routing.$inject = ['$stateProvider', '$urlRouterProvider'];
  function routing($stateProvider, $urlRouterProvider) {
    var notLogged = {
      home: {
        url: '/',
        abstract: true,
        views: {
         "nav": { 
          templateUrl: 'views/nav/notlogged.html'
        },                    
        "main": {
          template: '<ui-view/>'
        }
      }
    },
    register: {
      url: 'register',
      templateUrl: 'views/register.html',
      controller: 'RegisterController as register',
      title: 'Register'
    },
    login: {
      url: '',
      templateUrl: 'views/login.html',
      controller: 'LoginController as login',
      title: 'Login'
    }
  };
  var logged = {
    home: {
      url: '/app/',
      abstract: true,
      views: {
        "nav": { 
          templateUrl: 'views/nav/logged.html'
        },
        "main": {
          template: '<ui-view/>'
        }
      }
    },
    allClaims: {
      url: '',
      templateUrl: 'views/allclaims.html',
      controller: 'AllClaimsController as allClaims'
    },
    newClaim: {
      url: 'newclaim',
      templateUrl: 'views/newclaim.html',
      controller: 'NewClaimController as newClaim'
    },
    account: {
      url: 'account',
      templateUrl: 'views/account.html',
      controller: 'AccountController as account'
    },
    viewClaim: {
      url: 'claim/:id',
      templateUrl: 'views/viewclaim.html',
      controller: 'ViewClaimController as viewClaim'
    },
    addVessel: {
      url: 'addvessel',
      templateUrl: 'views/vessel.html',
      controller: 'VesselController as newVessel'
    }                     
  }
  
        // Define default route
        $urlRouterProvider.otherwise("/");
        
        $stateProvider
        .state('notLogged', notLogged.home)
        .state('notLogged.login', notLogged.login)
        .state('notLogged.register', notLogged.register)
        
        .state('logged', logged.home)
        .state('logged.allClaims', logged.allClaims)
        .state('logged.newClaim', logged.newClaim)
        .state('logged.account', logged.account)
        .state('logged.addVessel', logged.addVessel)
        .state('logged.viewClaim', logged.viewClaim);
      }
      
      titleChange.$inject = ['$rootScope'];
      function titleChange($rootScope) {

      // Set the title to change on every route change
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.title = (toState.title === undefined) ? BASE_TITLE : toState.title + ' | ' + BASE_TITLE;
      }); 
    }
  })(angular)