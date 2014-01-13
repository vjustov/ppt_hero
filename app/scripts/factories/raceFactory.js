'use strict';

angular.module('pptHeroApp')
    .factory('raceFactory', ['$http',
        function($http) {
            var urlBase = 'http://localhost:2929/api/v1/races';
            var raceFactory = {};

            raceFactory.getRaces = function() {
                return $http.get(urlBase);
            };

            raceFactory.getRace = function(id) {
                return $http.get(urlBase + '/' + id);
            };

            raceFactory.createRace = function(race) {
                return $http.post(urlBase, race);
            };

            raceFactory.editRace = function(race) {
                return $http.put(urlBase + '/' + race.id, race);
            };

            raceFactory.deleteRace = function(id) {
                return $http.delete(urlBase + '/' + id);
            };

            return raceFactory;
        }
    ]);