angular.module('QuizPOC.controllers', ['ui.bootstrap'])
.controller('LeaderCtrl', ['$scope', '$filter', function ($scope, $filter) {

	$scope.leaders = [];

	for (var i=0; i<20000; i++) {
        $scope.leaders.push({rank: i+1, name: "Joe Dunn " + i, fastest: "00:37", best: "712", total: "10231"});
    }	
		
	$scope.totalItems = $scope.leaders.length;
	$scope.currentPage = 1;
	$scope.pageSize = 25;	
    $scope.noOfPages = Math.ceil($scope.leaders.length/$scope.pageSize);
    
    $scope.$watch('search.name', function(term) {        
        $scope.filtered = $filter('filter')($scope.leaders, term);        
        $scope.totalItems = $scope.filtered.length;                
    });

	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;		
	};
	
}]);