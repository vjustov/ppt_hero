'use strict';

angular.module('pptHeroApp')
    .controller('RaceCtrl', ['$scope', 'raceFactory',
        function($scope, raceFactory) {

            $scope.status;
            $scope.races;
            $scope.pushable;
            $scope.editable;
            getRaces();

            $scope.tooglePushable = function() {
                $scope.pushable = !$scope.pushable;
            }

            $scope.toogleEditable = function(race) {
                race.editable = !race.editable;
            }

            function getRaces() {
                raceFactory.getRaces()
                    .success(function(races) {
                        $scope.races = races;
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to load races:' + error.message;
                    });
            }

            $scope.createRace = function(race) {
                raceFactory.createRace(race)
                    .success(function() {
                        $scope.status = 'Inserted race! Refreshing race list.';
                        $scope.races.push(race);
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to create race' + error.message;
                    });
                $scope.tooglePushable();
            };

            $scope.updateRace = function(race) {
                var index = $scope.races.indexOf(race);

                raceFactory.editRace(race)
                    .success(function() {
                        $scope.status = 'Updated race!. Refreshing Race list.'
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to update race:' + error.message;
                    });
                $scope.toogleEditable(race);
            };

            $scope.deleteRace = function(id) {

                var heroesWithRace;

                heroFactory.getHeroes()
                    .success(function(heroes) {
                        heroesWithRace = heroes.filter(function(hero) {
                            return hero.race_id == id;
                        });
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to fetch heroes to compare: ' + error.message;
                    }).then(function() {
                        if (heroesWithRace.length == 0) {
                            raceFactory.deleteRace(id)
                                .success(function() {
                                    $scope.status = 'Deleted race! Refreshing race list.';
                                    $scope.races.forEach(function(race, index) {
                                        if (race.id == id) {
                                            $scope.races.splice(index, 1);
                                        }
                                    });
                                })
                                .error(function(error) {
                                    $scope.status = 'Unable to delete race: ' + error.message;
                                });
                        } else {
                            $scope.status = 'Cannot delete a race while it still has heroes';
                        }
                    });
            };
        }
    ]);