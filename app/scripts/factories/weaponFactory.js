'use strict';

angular.module('pptHeroApp')
    .factory('weaponFactory', ['$http',
        function($http) {
            var urlBase = 'http://localhost:2929/api/v1/weapons';
            var weaponFactory = {};

            weaponFactory.getWeapons = function() {
                return $http.get(urlBase);
            };

            weaponFactory.getWeapon = function(id) {
                return $http.get(urlBase + '/' + id);
            };

            weaponFactory.createWeapon = function(weapon) {
                return $http.post(urlBase, weapon);
            };

            weaponFactory.editWeapon = function(weapon) {
                return $http.put(urlBase + '/' + weapon.id, weapon);
            };

            weaponFactory.deleteWeapon = function(id) {
                return $http.delete(urlBase + '/' + id);
            };

            return weaponFactory;
        }
    ]);