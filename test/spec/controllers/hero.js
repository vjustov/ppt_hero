'use strict';

describe('Controller: HeroCtrl', function () {

  // load the controller's module
  beforeEach(module('pptHeroApp'));

  var HeroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HeroCtrl = $controller('HeroCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
