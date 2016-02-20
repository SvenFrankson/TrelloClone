/*global
    angular
*/

var app = angular.module('trello-clone', ['ui.router', 'ui.bootstrap']);

app.factory('auth', ['$http', '$window', function ($http, $window) {
    "use strict";
    var auth = {};
    
    auth.saveToken = function (token) {
        $window.localStorage['trello-clone-token'] = token;
    };
    
    auth.getToken = function () {
        return $window.localStorage['trello-clone-token'];
    };
    
    auth.isLoggedIn = function () {
        var token = auth.getToken(),
            payload;
        if (token) {
            payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    
    auth.currentUserName = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken(),
                payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.username;
        }
    };
    
    auth.currentUserId = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken(),
                payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload._id;
        }
    };
    
    auth.register = function (user) {
        return $http.post('/register', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };
    
    auth.logIn = function (user) {
        return $http.post('/login', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };
    
    auth.logOut = function () {
        $window.localStorage.removeItem('trello-clone-token');
    };
    
    return auth;
}]);

app.factory('rooms', ['$http', 'auth', function ($http, auth) {
    "use strict";
    var r = {
        rooms : []
    };
    
    r.createRoom = function (room, userId) {
        alert("Create Room " + auth.isLoggedIn());
        alert("Room " + room);
        alert("UserId " + userId);
        if (auth.isLoggedIn()) {
            return $http.post('/rooms/add', room, {headers : {Authorization : 'Bearer ' + auth.getToken()}});
        }
    };
    
    return r;
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    "use strict";
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/partial-home.html',
            controller: 'HomeController'
        })
        .state('rooms', {
            url: '/rooms/{id}',
            templateUrl: 'views/partial-rooms.html',
            controller: 'RoomController'
        });
    
    $urlRouterProvider.otherwise('home');
}]);

app.controller('AuthController', ['$scope', 'auth', function ($scope, auth) {
    "use strict";
    $scope.newUser = false;
    $scope.user = {};
    
    $scope.register = function () {
        auth.register($scope.user);
    };
    
    $scope.logIn = function () {
        auth.logIn($scope.user);
    };
    
    $scope.logOut = function () {
        return auth.logOut();
    };
    
    $scope.isLoggedIn = function () {
        return auth.isLoggedIn();
    };
    
    $scope.currentUserName = function () {
        return auth.currentUserName();
    };
}]);

app.controller('HomeController', ['$scope', 'auth', 'rooms', function ($scope, auth, rooms) {
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
    
    $scope.newRoom = {};
    $scope.rooms = rooms.rooms;
    
    $scope.addRoom = function () {
        rooms.createRoom($scope.newRoom, auth.currentUserId());
    };
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