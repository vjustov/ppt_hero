'use strict';

angular.module('pptHeroApp')
    .controller('JobCtrl', ['$scope', 'jobFactory', 'heroFactory',
        function($scope, jobFactory, heroFactory) {

            $scope.status;
            $scope.jobs;
            $scope.pushable;
            $scope.editable;
            getJobs();

            $scope.tooglePushable = function() {
                $scope.pushable = !$scope.pushable;
            }

            $scope.toogleEditable = function(job) {
                job.editable = !job.editable;
            }

            function getJobs() {
                jobFactory.getJobs()
                    .success(function(jobs) {
                        $scope.jobs = jobs;
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to load jobs: ' + error.message;
                    });
            }

            $scope.createJob = function(job) {
                jobFactory.createJob(job)
                    .success(function() {
                        $scope.status = 'Inserted job! Refreshing job list.';
                        $scope.jobs.push(job);
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to create job: ' + error.message;
                    });
                $scope.tooglePushable();
                $scope.job = {};
            };

            $scope.updateJob = function(job) {
                var index = $scope.jobs.indexOf(job);

                jobFactory.editJob(job)
                    .success(function() {
                        $scope.status = 'Updated job!. Refreshing Job list.'
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to update job: ' + error.message;
                    });
                $scope.toogleEditable(job);
            };

            $scope.deleteJob = function(id) {

                var heroesWithJob;

                heroFactory.getHeroes()
                    .success(function(heroes) {
                        heroesWithJob = heroes.filter(function(hero) {
                            return hero.job_id == id;
                        });
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to fetch heroes to compare: ' + error.message;
                    }).then(function() {
                        if (heroesWithJob.length == 0) {
                            jobFactory.deleteJob(id)
                                .success(function() {
                                    $scope.status = 'Deleted job! Refreshing job list.';
                                    $scope.jobs.forEach(function(job, index) {
                                        if (job.id == id) {
                                            $scope.jobs.splice(index, 1);
                                        }
                                    });
                                })
                                .error(function(error) {
                                    $scope.status = 'Unable to delete job: ' + error.message;
                                });
                        } else {
                            $scope.status = 'Cannot delete a job while it still has heroes';
                        }
                    });
            };
        }
    ]);