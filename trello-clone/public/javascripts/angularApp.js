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
    
    r.getRooms = function (room, userId) {
        $http.get('/rooms/').success(function (data) {
            angular.copy(data, r.rooms);
        });
    };
    
    r.createRoom = function (room, userId) {
        if (auth.isLoggedIn()) {
            $http.post('/rooms/addRoom', room, {headers : {Authorization : 'Bearer ' + auth.getToken()}});
        }
    };
    
    return r;
}]);

app.service('roomService', ['$http', 'auth', function ($http, auth) {
    "use strict";
    var roomService = {};
    
    roomService.getRoom = function (room, roomId) {
        return $http.post('/rooms/getRoom', {roomId : roomId}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
            angular.copy(data, room);
        });
    };
    
    roomService.addBoard = function (room, boardName) {
        if (auth.isLoggedIn()) {
            $http.post('/rooms/addBoard', {roomId : room._id, boardName : boardName}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room, room._id);
            });
        }
    };
    
    roomService.addTag = function (room, tag) {
        if (auth.isLoggedIn()) {
            $http.post('/rooms/addTag', {roomId : room._id, tag : tag}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room, room._id);
            });
        }
    };
    
    return roomService;
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    "use strict";
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/partial-home.html',
            controller: 'HomeController',
            resolve : {
                populate : ['rooms', function (rooms) {
                    return rooms.getRooms();
                }]
            }
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
    $scope.newRoom = {};
    $scope.rooms = rooms.rooms;
    
    $scope.addRoom = function () {
        rooms.createRoom($scope.newRoom, auth.currentUserId());
        $scope.newRoom = {};
        rooms.getRooms();
    };
}]);

app.controller('RoomController', ['$scope', '$stateParams', '$http', 'rooms', 'roomService', 'auth', function ($scope, $stateParams, $http, rooms, roomService, auth) {
    "use strict";
    $scope.room = rooms.rooms[$stateParams.id];
    roomService.getRoom($scope.room, $scope.room._id);
    
    $scope.addBoard = function () {
        if ((!$scope.newBoardName) || ($scope.newBoardName === "")) {
            return;
        }
        roomService.addBoard($scope.room, $scope.newBoardName);
    };
    
    $scope.addTag = function () {
        if ((!$scope.newTagName) || ($scope.newTagName === "")) {
            return;
        }
        roomService.addTag($scope.room, {name : $scope.newTagName, color : $scope.newTagColor});
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