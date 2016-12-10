'use strict';

(function(){
	angular.module('wsi')
		.service('UserService', function(){

			this.user = {};

			this.setUser = function (user) {
				this.user = user;
			}

			this.getUser = function () {
				return this.user;
			}

			return this;
		});
})();