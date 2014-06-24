'use strict';

function gup(name){
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
		var regexS = "[\\?&]"+name+"=([^&#]*)";  
		var regex = new RegExp( regexS );  
		var results = regex.exec( window.location.href ); 
		 if( results == null )    return "";  
		else    return results[1];
	}

angular.module('QuizPOC.controllers', ['ui.bootstrap','dialogs'])
.controller('QstnCtrl',['$scope', '$timeout', '$dialogs', function($scope, $timeout, $dialogs) {

	$scope.questions = [
		{text:'What is the capital of Texas?', ans1: 'Dallas', ans2: 'Austin', ans3: 'San Antonio', ans4: 'Houston', correct: 'ans2'},
		{text:'What is the capital of California?', ans1: 'Sacramento', ans2: 'Los Angeles', ans3: 'San Diego', ans4: 'San Francisco', correct: 'ans1'}
	];

	$scope.achievements = [
		{name: 'The Flash', desc: 'Answer correctly in 1 second or less'},
		{name: 'Double-Tap', desc: 'Quickly answer 2 questions correctly'},
		{name: 'Aced', desc: 'Get a perfect score'}
	];

	var curQstn = 0;
	var curScore = 0;
	var achCounter = 0;
	var mytimeout;
	var achTimer;
	$scope.showChievo = false;
	$scope.incomplete = true;
	$scope.maxScore = $scope.questions.length * 10;
	$scope.quiz = gup('cat_id');
	$scope.counter = 20;
	$scope.times = new Array();
	$scope.barWidth = ($scope.counter / 20) * 100;
	$scope.confirmed = "";

	$scope.achievement;
	$scope.chievos = new Array();

	$scope.quizName = function() {
		var name = 'Not named';
		switch($scope.quiz){
			case '1':
				name = 'Sample Quiz 1';
				break;
			case '2':
				name = 'Sample Quiz 2';
				break;
			case '3':
				name = 'Sample Quiz 3';
				break;
		}

		return name;
	}

	$scope.score = function() { 		
		return curScore;
	}

	$scope.currentQstn = function() {
		return $scope.questions[curQstn];
	}

	$scope.nextQstn = function(answer) {
		//stopTimer();
		$scope.times.push(20 - $scope.counter);
		$scope.counter = 20;
		$scope.barWidth = 100;

		if(answer == $scope.questions[curQstn].correct){
			curScore += 10;
			//openDiag();
			if($scope.times[curQstn] < 5 && $scope.times[curQstn - 1] < 5){
				showAchieve('double-tap');
			}
			else if($scope.times[curQstn] < 2) {
				showAchieve('flash');
			}
		}

		if(curQstn < ($scope.questions.length - 1)){
			curQstn++;			
		}
		else {
			$scope.incomplete = false;
			stopTimer();			
		}		
	}	
    
    $scope.onTimeout = function(){
        if($scope.counter > 0){
            $scope.counter--;
            mytimeout = $timeout($scope.onTimeout,1000);
            $scope.barWidth = ($scope.counter / 20) * 100;
        }
        else {
            stopTimer();
            //openDiag();
        }
    }

    var startTimer = function() {
    	mytimeout = $timeout($scope.onTimeout,1000);
	}

	var stopTimer = function() {
		$timeout.cancel(mytimeout);    	
	}

	var startAchTimer = function() {
    	achTimer = $timeout($scope.onAchTimeout,1000);
	}

	var stopAchTimer = function() {
		$timeout.cancel(achTimer);    	
	}

	$scope.onAchTimeout = function(){
        if(achCounter < 2){
            achCounter++;
            achTimer = $timeout($scope.onAchTimeout,1000);            
        }
        else {
            stopAchTimer();
            $scope.showChievo = false;            
        }
    }

	var showAchieve = function(type) {
		if($scope.showChievo) {
			$scope.showChievo = false;
			stopAchTimer();
		}
		
		switch(type){
			case 'flash':
				$scope.chievos.push('flash');
				$scope.achievement = $scope.achievements[0];
				break;
			case 'double-tap':
				$scope.chievos.push('double-tap');
				$scope.achievement = $scope.achievements[1];
				break;
		}

		$scope.showChievo = true;
		startAchTimer();
	}

    var openDiag = function(){
    	var dlg = $dialogs.confirm('Ready?','You will have 20 seconds per question. The faster your answer, the higher your score!');
		dlg.result.then(function(btn){
			startTimer();
		});
    }

    openDiag();
}]);