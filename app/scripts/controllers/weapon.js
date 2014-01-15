'use strict';

angular.module('pptHeroApp')
    .controller('WeaponCtrl', ['$scope', 'weaponFactory',
        function($scope, weaponFactory) {

            $scope.status;
            $scope.weapons;
            $scope.pushable;
            $scope.editable;
            getWeapons();

            $scope.tooglePushable = function() {
                $scope.pushable = !$scope.pushable;
            }

            $scope.toogleEditable = function(weapon) {
                weapon.editable = !weapon.editable;
            }

            function getWeapons() {
                weaponFactory.getWeapons()
                    .success(function(weapons) {
                        $scope.weapons = weapons;
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to load weapons: ' + error.message;
                    });
            }

            $scope.createWeapon = function(weapon) {
                weaponFactory.createWeapon(weapon)
                    .success(function() {
                        $scope.status = 'Inserted weapon! Refreshing weapon list.';
                        $scope.weapons.push(weapon);
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to create weapon: ' + error.message;
                    });
                $scope.tooglePushable();
                $scope.weapon = {};
            };

            $scope.updateWeapon = function(weapon) {
                var index = $scope.weapons.indexOf(weapon);

                weaponFactory.editWeapon(weapon)
                    .success(function() {
                        $scope.status = 'Updated weapon!. Refreshing Weapon list.'
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to update weapon: ' + error.message;
                    });
                $scope.toogleEditable(weapon);
            };

            $scope.deleteWeapon = function(id) {

                var heroesWithWeapon;

                heroFactory.getHeroes()
                    .success(function(heroes) {
                        heroesWithWeapon = heroes.filter(function(hero) {
                            return hero.weapon_id == id;
                        });
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to fetch heroes to compare: ' + error.message;
                    }).then(function() {
                        if (heroesWithWeapon.length == 0) {
                            weaponFactory.deleteWeapon(id)
                                .success(function() {
                                    $scope.status = 'Deleted weapon! Refreshing weapon list.';
                                    $scope.weapons.forEach(function(weapon, index) {
                                        if (weapon.id == id) {
                                            $scope.weapons.splice(index, 1);
                                        }
                                    });
                                })
                                .error(function(error) {
                                    $scope.status = 'Unable to delete weapon: ' + error.message;
                                });
                        } else {
                            $scope.status = 'Cannot delete a weapon while it still has heroes';
                        }
                    });
            };
        }
    ]);