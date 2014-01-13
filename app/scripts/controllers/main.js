'use strict';

angular.module('pptHeroApp')
  .controller('MainCtrl', function ($scope, $http) {
    
    $scope.roles = [
      'heroes',
      'weapons',
      'races',
      'jobs'
    ];

    $scope.role = 'heroes';

    $scope.changeRole = function(role){
      $scope.role = role;
    };
  });
