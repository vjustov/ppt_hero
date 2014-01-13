'use strict';

var app = angular.module('pptHeroApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
]);
app.config(function($routeProvider) {
    $routeProvider
        .when('/heroes', {
            templateUrl: 'views/hero.html',
            controller: 'HeroCtrl'
        })
        .when('/weapons', {
            templateUrl: 'views/weapon.html',
            controller: 'WeaponCtrl'
        })
        .when('/races', {
            templateUrl: 'views/race.html',
            controller: 'RaceCtrl'
        })
        .when('/jobs', {
            templateUrl: 'views/jobs.html',
            controller: 'JobCtrl'
        })
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.run(function($rootScope) {
    $rootScope.APIUrl = 'http://localhost:2929/';
});