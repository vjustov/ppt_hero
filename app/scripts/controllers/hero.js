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

            $scope.hero;
            $scope.sex;
            $scope.race;

            $scope.tooglePushable = function() {
                $scope.pushable = !$scope.pushable;
                $scope.hero = {};
            }

            $scope.edit = function(hero) {
                $scope.hero = hero;
                $scope.race = $scope.races.filter(function(race) {
                    return race.id == hero.race_id;
                })[0].name;
                $scope.hero.editable = true;
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

            $scope.changeSex = function() {
                $scope.hero.sex = $scope.hero.sex == 'Male' ? 'Female' : 'Male'
            };

            $scope.changeRace = function(direction) {
                var races = $scope.races.map(function(race) {
                    return race.name
                });
                var direction = direction == 'next' ? 1 : -1;
                var index = races.indexOf($scope.race) + direction;
                if (index >= 0 && index < races.length) {
                    $scope.race = races[index];
                    $scope.hero.race_id = $scope.races[index].id;
                }
            };

            $scope.createHero = function(hero) {
                heroFactory.createHero(hero)
                    .success(function() {
                        getHeroes();
                        $scope.status = 'Created hero! Refreshing hero guild.';
                        // $scope.heroes.push(hero);
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to create hero: ' + error.message;
                    });
                $scope.tooglePushable();
                $scope
            };

            $scope.updateHero = function(hero) {
                var index = $scope.heroes.indexOf(hero);

                heroFactory.editHero(hero)
                    .success(function() {
                        $scope.status = 'Updated hero!. Refreshing Hero list.'
                        getHeroes();
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to update hero: ' + error.message;
                    });
                $scope.hero = {};
            };

            $scope.deleteHero = function(id) {
                heroFactory.deleteHero(id)
                    .success(function() {
                        $scope.status = 'Deleted hero! Refreshing hero list.';
                        getHeroes();
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to delete hero: ' + error.message;
                    });
            };
        }
    ]);