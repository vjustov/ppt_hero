'use strict';

angular.module('pptHeroApp')
    .factory('jobFactory', ['$http',
        function($http) {
            var urlBase = 'http://localhost:2929/api/v1/jobs';
            var jobFactory = {};

            jobFactory.getJobs = function() {
                return $http.get(urlBase);
            };

            jobFactory.getJob = function(id) {
                return $http.get(urlBase + '/' + id);
            };

            jobFactory.createJob = function(job) {
                return $http.post(urlBase, job);
            };

            jobFactory.editJob = function(job) {
                return $http.put(urlBase + '/' + job.id, job);
            };

            jobFactory.deleteJob = function(id) {
                return $http.delete(urlBase + '/' + id);
            };

            return jobFactory;
        }
    ]);