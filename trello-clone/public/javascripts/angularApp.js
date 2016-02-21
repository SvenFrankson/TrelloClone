/*jslint nomen: true */
/*global
    angular
*/

var app = angular.module('trello-clone', ['ui.router', 'ui.bootstrap', 'angularMoment', 'colorpicker.module']);

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
    
    roomService.getRoom = function (room) {
        return $http.post('/rooms/getRoom', {roomId : room._id}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
            angular.copy(data, room);
        });
    };
    
    roomService.addBoard = function (room, boardName) {
        if (auth.isLoggedIn()) {
            $http.post('/rooms/addBoard', {roomId : room._id, boardName : boardName}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    roomService.addTag = function (room, tag) {
        if (auth.isLoggedIn()) {
            $http.post('/rooms/addTag', {roomId : room._id, tag : tag}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    roomService.addUser = function (room, username) {
        alert("CTRL")
        if (auth.isLoggedIn()) {
            $http.post('/rooms/addUser', {room : room, username : username}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    return roomService;
}]);

app.service('boardService', ['$http', 'auth', 'roomService', function ($http, auth, roomService) {
    "use strict";
    var boardService = {};
    
    boardService.addTask = function (room, board, task) {
        if (auth.isLoggedIn()) {
            $http.post('/boards/addTask', {boardId : board._id, task : task}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    boardService.saveBoard = function (room, board) {
        if (auth.isLoggedIn()) {
            $http.post('/boards/save', {board : board}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    boardService.deleteBoard = function (room, board) {
        if (auth.isLoggedIn()) {
            $http.post('/boards/remove', {board : board}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    return boardService;
}]);

app.service('taskService', ['$http', 'auth', 'roomService', function ($http, auth, roomService) {
    "use strict";
    var taskService = {};
    
    taskService.addTag = function (room, task, tagIndex) {
        if (auth.isLoggedIn()) {
            $http.post('/tasks/addTag', {task : task, tagIndex : tagIndex}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    taskService.removeTag = function (room, task, tagIndex) {
        if (auth.isLoggedIn()) {
            $http.post('/tasks/removeTag', {task : task, tagIndex : tagIndex}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    taskService.saveTask = function (room, task) {
        if (auth.isLoggedIn()) {
            $http.post('/tasks/save', {task : task}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    taskService.removeTask = function (room, task) {
        if (auth.isLoggedIn()) {
            $http.post('/tasks/remove', {task : task}, {headers : {Authorization : 'Bearer ' + auth.getToken()}}).success(function (data) {
                return roomService.getRoom(room);
            });
        }
    };
    
    return taskService;
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
            controller: 'RoomController',
            resolve : {
                populateDeep : ['$stateParams', 'rooms', 'roomService', function ($stateParams, rooms, roomService) {
                    roomService.getRoom(rooms.rooms[$stateParams.id]);
                }]
            }
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

app.controller('RoomController', ['$scope', '$stateParams', '$http', 'rooms', 'roomService', 'boardService', 'taskService', 'auth', function ($scope, $stateParams, $http, rooms, roomService, boardService, taskService, auth) {
    "use strict";
    $scope.room = rooms.rooms[$stateParams.id];
    
    $scope.addBoard = function () {
        if ((!$scope.newBoardName) || ($scope.newBoardName === "")) {
            return;
        }
        roomService.addBoard($scope.room, $scope.newBoardName);
        $scope.newBoardName = "";
    };
    
    $scope.addTag = function () {
        if ((!$scope.newTagName) || ($scope.newTagName === "")) {
            return;
        }
        roomService.addTag($scope.room, {name : $scope.newTagName, color : $scope.newTagColor});
        $scope.newTagName = "";
        $scope.newTagColor = "";
    };
    
    $scope.addUser = function () {
        alert("CTRL")
        roomService.addUser($scope.room, $scope.newUser);
        $scope.newUser = "";
    };
    
    $scope.addTask = function (board) {
        if ((!board.newTaskContent) || (board.newTaskContent === "")) {
            return;
        }
        boardService.addTask($scope.room, board, { content : board.newTaskContent, dueDate : new Date()});
        board.newTaskContent = "";
    };
    
    $scope.saveTask = function (task) {
        taskService.saveTask($scope.room, task);
    };
    
    $scope.removeTask = function (task) {
        taskService.removeTask($scope.room, task);
    };
    
    $scope.saveBoard = function (board) {
        boardService.saveBoard($scope.room, board);
    };
    
    $scope.deleteBoard = function (board) {
        boardService.deleteBoard($scope.room, board);
    };
    
    $scope.addTagToTask = function (task, tag) {
        taskService.addTag($scope.room, task, tag);
    };
    
    $scope.removeTagFromTask = function (task, tagIndex) {
        taskService.removeTag($scope.room, task, tagIndex);
    };
}]);