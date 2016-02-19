/*global
    angular
*/

var app = angular.module('trello-clone', ['ui.router', 'ui.bootstrap']);

app.factory('user', [function () {
    "use strict";
    var u = {
        user : {}
    };
    return u;
}]);

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
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .state('rooms', {
            url: '/rooms/{id}',
            templateUrl: 'rooms.html',
            controller: 'RoomController'
        });
    
    $urlRouterProvider.otherwise('home');
}]);

app.controller('UserController', ['$scope', 'user', function ($scope, user) {
    "use strict";
}]);

app.controller('HomeController', ['$scope', 'rooms', function ($scope, rooms) {
    "use strict";
    if (rooms.rooms.length === 0) {
        rooms.rooms.push({
            name: "My test room",
            taskLists: [
                {
                    name: "TaskList1",
                    tasks: [
                        { rank: 0, content: "Do the dishes", tags: [0, 2, 3]},
                        { rank: 1, content: "Do the laundry", tags: []}
                    ]
                },
                {
                    name: "TaskListMore",
                    tasks: [
                        { rank: 0, content: "Do more dishes", tags: [1, 2]},
                        { rank: 1, content: "Do more laundry", tags: [3]}
                    ]
                }
            ],
            users: ["Andrew", "Bryan", "Chuck"],
            tags: [
                { name: "Smooth", color: "#e3a0f0"},
                { name: "Easy", color: "#b7f0a0"},
                { name: "Normal", color: "#a0eef0"},
                { name: "Hard", color: "#df4a4a"},
                { name: "Insane", color: "#545454"}
            ]
        });
        rooms.rooms.push({
            name: "My other room",
            taskLists: [
                {
                    name: "TaskList1",
                    tasks: [
                        { rank: 0, content: "Do the dishes", tags: [0, 2, 3]},
                        { rank: 1, content: "Do the laundry", tags: []}
                    ]
                },
                {
                    name: "TaskListMore",
                    tasks: [
                        { rank: 0, content: "Do more dishes", tags: [1, 2]},
                        { rank: 1, content: "Do more laundry", tags: [3]}
                    ]
                }
            ],
            users: ["Danny", "Eliott", "Frank"],
            tags: [
                { name: "Smooth", color: "pink"},
                { name: "Easy", color: "green"},
                { name: "Normal", color: "blue"},
                { name: "Hard", color: "red"},
                { name: "Insane", color: "black"}
            ]
        });
        rooms.rooms.push({
            name: "My third room",
            taskLists: [
                {
                    name: "TaskList1",
                    tasks: [
                        { rank: 0, content: "Do the dishes", tags: [0, 2, 3]},
                        { rank: 1, content: "Do the laundry", tags: []}
                    ]
                },
                {
                    name: "TaskListMore",
                    tasks: [
                        { rank: 0, content: "Do more dishes", tags: [1, 2]},
                        { rank: 1, content: "Do more laundry", tags: [3]}
                    ]
                }
            ],
            users: ["Andrew", "Chuck", "Eliott"],
            tags: [
                { name: "Smooth", color: "pink"},
                { name: "Easy", color: "green"},
                { name: "Normal", color: "blue"},
                { name: "Hard", color: "red"},
                { name: "Insane", color: "black"}
            ]
        });
    }
    
    $scope.rooms = rooms.rooms;
}]);

app.controller('RoomController', ['$scope', '$stateParams', 'rooms', function ($scope, $stateParams, rooms) {
    "use strict";
    $scope.room = rooms.rooms[$stateParams.id];
    
    $scope.addTaskList = function () {
        if ((!$scope.newTaskListName) || ($scope.newTaskListName === "")) {
            return;
        }
        $scope.room.taskLists.push({ name: $scope.newTaskListName, tasks: [], users: []});
        $scope.newTaskListName = "";
    };
    
    $scope.addTag = function () {
        if ((!$scope.newTagName) || ($scope.newTagName === "")) {
            return;
        }
        $scope.room.tags.push({ name: $scope.newTagName, color: $scope.newTagColor });
        $scope.newTagName = "";
        $scope.newTagColor = "";
    };
    
    $scope.addTaskToList = function (tasklist) {
        if ((!tasklist.newTaskName) || (tasklist.newTaskName === "")) {
            return;
        }
        tasklist.tasks.push({ rank: tasklist.tasks.length, content: tasklist.newTaskName, tags: []});
        tasklist.newTaskName = "";
    };
    
    $scope.addTagToTask = function (task, tag) {
        if (task.tags.indexOf(tag) === -1) {
            task.tags.push(tag);
        }
    };
}]);