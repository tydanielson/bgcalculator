'use strict';

(function(){
	angular.module('wsi')
		.controller('LoginCtrl', function($scope, $state, $firebaseAuth, UserService){

			var auth = $firebaseAuth();
			var provider = new firebase.auth.GoogleAuthProvider();			

			$scope.googleAuth = function () {
				firebase.auth().signInWithPopup(provider).then(function(result) {
				  // This gives you a Google Access Token. You can use it to access the Google API.
				  var token = result.credential.accessToken;
				  // The signed-in user info.
				  var user = result.user;

				  UserService.setUser(user);
				  console.log(user);
				  //save the user? 
				  // ...
				}).catch(function(error) {
				  // Handle Errors here.
				  var errorCode = error.code;
				  var errorMessage = error.message;
				  // The email of the user's account used.
				  var email = error.email;
				  // The firebase.auth.AuthCredential type that was used.
				  var credential = error.credential;
				  // ...
				});
			}
			// $scope.login = {};
			// var cognitoUser;

			// AWSCognito.config.region = 'us-east-1';
 
			// var poolData = {
			//     UserPoolId : 'us-east-1_A6IQFgIov', // your user pool id here
			//     ClientId : '1q7jc6gitdkd0sfaelkd2r5jc2' // your app client id here
			// };
			// var userPool = 
			// new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

			$scope.signup = function () {
			 //    var attributeList = [];

			 //    var dataEmail = {
			 //        Name : 'email',
			 //        Value : 'tysdanielson@gmail.com'
			 //    };

			 //    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

			 //    attributeList.push(attributeEmail);

				// userPool.signUp('tysdanielson@gmail.com', 'Test123!', attributeList, null, function(err, result){
			 //        if (err) {
			 //            alert(err);
			 //            return;
			 //        }
			 //        cognitoUser = result.user;
			 //        console.log('user name is ' + cognitoUser.getUsername());
			 //        $state.go('index.login.confirmation');
			 //    });

			};

			$scope.confirm = function () {
				// var userData = {
				//     Username : 'tysdanielson@gmail.com',
				//     Pool : userPool
				// };

			 //    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
			 //    cognitoUser.confirmRegistration($scope.login.confirmation, true, function(err, result) {
			 //        if (err) {
			 //            alert(err);
			 //            return;
			 //        }
			 //        console.log('call result: ' + result);
			 //    });
			};

			$scope.signin = function () {
			 //    var attributeList = [];

			 //    var dataEmail = {
			 //        Name : 'email',
			 //        Value : 'tysdanielson@gmail.com'
			 //    };

			 //    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

			 //    attributeList.push(attributeEmail);

				// userPool.signUp('tdanielson', 'Test123!', attributeList, null, function(err, result){
			 //        if (err) {
			 //            alert(err);
			 //            return;
			 //        }
			 //        cognitoUser = result.user;
			 //        console.log('user name is ' + cognitoUser.getUsername());
			 //    });
			}
	});
})();