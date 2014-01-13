'use strict';

angular.module('pptHeroApp')
    .factory('heroFactory', ['$http',
        function($http) {
            var urlBase = 'http://localhost:2929/api/v1/heroes';
            var heroFactory = {};

            heroFactory.getHeroes = function() {
                return $http.get(urlBase);
            };

            heroFactory.getHero = function(id) {
                return $http.get(urlBase + '/' + id);
            };

            heroFactory.createHero = function(hero) {
                return $http.post(urlBase, hero);
            };

            heroFactory.editHero = function(hero) {
                return $http.put(urlBase + '/' + hero.id, hero);
            };

            heroFactory.deleteHero = function(id) {
                return $http.delete(urlBase + '/' + id);
            };

            return heroFactory;
        }
    ]);