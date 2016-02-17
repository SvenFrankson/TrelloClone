/*global
    angular
*/

var app = angular.module('trelloClone', ['ui.router']);

app.factory('rooms', [function () {
    "use strict";
    var r = {
        rooms : []
    };
    return r;
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    "use strict";
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'HomeController'
        })
        .state('rooms', {
            url: '/rooms/{id}',
            templateUrl: '/rooms.html',
            controller: 'RoomController'
        });
    
    $urlRouterProvider.otherwise('home');
}]);

app.controller('HomeController', ['$scope', 'rooms', function ($scope, rooms) {
    "use strict";
    rooms.rooms.push({name: "My test room"});
    rooms.rooms.push({name: "My other room"});
    rooms.rooms.push({name: "My third room"});
    $scope.rooms = rooms.rooms;
}]);

app.controller('RoomController', ['$scope', '$stateParams', 'rooms', function ($scope, $stateParams, rooms) {
    "use strict";
}]);