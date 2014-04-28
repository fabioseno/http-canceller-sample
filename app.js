var app = angular.module('core', []);

app.service('httpHandler', ['$http', '$q', function ($http, $q) {
    'use strict';
    
    var groups = {};
    
    this.hit = function (url, groupName) {
        
        var defer;
        
        if (!groupName) {
            groupName = 'default';
        }
        
        if (!groups[groupName]) {
            defer = $q.defer();
            
            groups[groupName] = defer;
        } else {
            defer = groups[groupName];
        }
        
        return $http.get(url, { timeout: defer.promise });
    };
    
    this.cancelRequest = function (groupName) {
        
        if (!groupName) {
            groupName = 'default';
        }
        
        groups[groupName].resolve('cancelled');
        delete groups[groupName];
    };
    
}]);

app.controller('sampleController', ['$scope', 'httpHandler', function ($scope, httpHandler) {
    'use strict';
    
    $scope.requests = [];
    
    $scope.fire = function () {
        var i, j, request, numberOfRequests = 8;
        
        $scope.requests = [];
        
        for (i = 0; i < numberOfRequests; i += 1) {
            request = {
                url: 'http://localhost:8080/test/' + i,
                message: 'Processing...',
                color: 'black'
            };
            
            httpHandler.hit(request.url).success(function (data, status, headers, config) {
                var url = request.url;
                
                for (j = 0; j < numberOfRequests; j += 1) {
                    if ($scope.requests[j].url === config.url) {
                        $scope.requests[j].message = 'Processed!';
                        $scope.requests[j].color = 'green';
                        break;
                    }
                }
                
            }).error(function (error, status, headers, config) {
                for (j = 0; j < numberOfRequests; j += 1) {
                    if ($scope.requests[j].url === config.url) {
                        $scope.requests[j].message = status === 0 ? 'Cancelled' : 'Unknown error.';
                        $scope.requests[j].color = 'red';
                        break;
                    }
                }
            });
            
            $scope.requests.push(request);
        }
        
    };
    
    $scope.cancel = function () {
        httpHandler.cancelRequest();
    };
    
}]);