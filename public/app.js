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
    rooms.rooms = [];
    rooms.rooms.push({
        name: "My test room",
        taskLists: [
            {
                name: "TaskList1",
                tasks: [
                    "Do the dishes",
                    "Do the laundry"
                ]
            },
            {
                name: "TaskListMore",
                tasks: [
                    "Do more dishes",
                    "Do more laundry"
                ]
            }
        ],
        users: ["Andrew", "Bryan", "Chuck"]
    });
    rooms.rooms.push({
        name: "My other room",
        taskLists: [
            {
                name: "TaskList2",
                tasks: [
                    "Do the carwash",
                    "Do the laundry"
                ]
            },
            {
                name: "TaskListNext",
                tasks: [
                    "Do more dishes",
                    "Do more carwash"
                ]
            }
        ],
        users: ["Danny", "Eliott", "Frank"]
    });
    rooms.rooms.push({
        name: "My third room",
        taskLists: [
            {
                name: "TaskList3",
                tasks: [
                    "Do the carwash",
                    "Do the laundry"
                ]
            },
            {
                name: "TaskListOther",
                tasks: [
                    "Do nothing",
                    "Do more carwash"
                ]
            }
        ],
        users: ["Andrew", "Chuck", "Eliott"]
    });
    $scope.rooms = rooms.rooms;
}]);

app.controller('RoomController', ['$scope', '$stateParams', 'rooms', function ($scope, $stateParams, rooms) {
    "use strict";
    $scope.room = rooms.rooms[$stateParams.id];
}]);