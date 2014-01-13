'use strict';
//angular.module('pptHeroApp').controller('HeroCtrl', function($scope) {});

angular.module('pptHeroApp')
    .controller('HeroCtrl', ['$scope', 'heroFactory', 'jobFactory',
        'raceFactory', 'weaponFactory',
        function($scope, heroFactory,
            jobFactory, raceFactory, weaponFactory) {

            $scope.status;
            $scope.heroes;
            $scope.pushable;
            $scope.editable;
            getHeroes();

            $scope.tooglePushable = function() {
                $scope.pushable = !$scope.pushable;
            }

            $scope.toogleEditable = function(hero) {
                hero.editable = !hero.editable;
            }

            function mergeData(heroes, weapons, jobs, races) {

                return heroes.map(function(hero) {
                    var weapon = weapons.filter(function(weapon) {
                        return weapon.id == hero.weapon_id;
                    });

                    var job = jobs.filter(function(job) {
                        return job.id == hero.job_id;
                    });

                    var race = races.filter(function(race) {
                        return race.id == hero.race_id;
                    });

                    return {
                        'id': hero.id,
                        'name': hero.name,
                        'weapon': weapon[0].name,
                        'job': job[0].name,
                        'race': race[0].name
                    };

                });
            }

            function getHeroes() {
                heroFactory.getHeroes()
                    .success(function(heroes) {
                        $scope.heroes = heroes;
                        Promise.all([jobFactory.getJobs(), raceFactory.getRaces(), weaponFactory.getWeapons()])
                            .then(function(responses) {
                                // $scope.$apply(function() {
                                var responses = responses.reduce(function(previousValue, currentValue, indexArray, array) {
                                    var url = currentValue.config.url;
                                    var index = url.lastIndexOf('/') + 1;

                                    var obj;

                                    if (indexArray == 1) {
                                        var prevUrl = previousValue.config.url;
                                        var prevIndex = url.lastIndexOf('/') + 1;

                                        obj = {};
                                        obj[prevUrl.substring(prevIndex)] = previousValue.data;
                                    } else {
                                        obj = previousValue;
                                    }

                                    obj[url.substring(index)] = currentValue.data;
                                    return obj;
                                });

                                $scope.$apply(function() {
                                    $scope.weapons = responses.weapons;
                                    $scope.races = responses.races;
                                    $scope.jobs = responses.jobs;

                                    $scope.heroesData = mergeData(heroes, responses.weapons, responses.jobs, responses.races);
                                });
                                // }
                            }).
                        catch (function(error) {
                            $scope.status = 'Unable to load additional data: ' + error.message;
                        })
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to load heroes: ' + error.message
                    });
            }

            $scope.createHero = function(hero) {
                heroFactory.createHero(hero)
                    .success(function() {
                        $scope.status = 'Created hero! Refreshing hero guild.';
                        $scope.heroes.push(hero);
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to create hero: ' + error.message;
                    })
            };

            $scope.updateHero = function(hero) {
                var index = $scope.heroes.indexOf(hero);

                heroFactory.editHero(hero)
                    .success(function() {
                        $scope.status = 'Updated hero!. Refreshing Hero list.'
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to update hero: ' + error.message;
                    });
                $scope.toogleEditable(hero);
            };

            $scope.deleteHero = function(id) {
                heroFactory.deleteHero(id)
                    .success(function() {
                        $scope.status = 'Deleted hero! Refreshing hero list.';
                        $scope.heroes.forEach(function(hero, index) {
                            if (hero.id == id) {
                                $scope.heroes.splice(index, 1);
                            }
                        });
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to delete hero: ' + error.message;
                    });
            };
        }
    ]);