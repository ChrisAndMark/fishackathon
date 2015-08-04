(function(angular) {
  angular.module('SeaScape')
    .service('ClaimService', service);
    
  service.$inject = ['$q', 'ApiService'];
  function service($q, ApiService) {
    this.add = add; 
  
    function add(claim) {
      var deferred = $q.defer();
      var data = {
        vessel_id: vessel.vname,
        fishing_gear: vessel.vstateregno,
        target_species: vessel.vcommercialno,
        date_time: vessel.fisheryIdNo,
        longtitude: '',
        latitude: '',
        notes: '',
        species: '',
        type: ''
      };
      
      ApiService.post('claim', data)
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