angular.module('weixin.controllers', [])

.controller('findCtrl', function($scope, $state) {
    $scope.onSwipeLeft = function() {
        $state.go("tab.setting");
    };
    $scope.onSwipeRight = function() {
        $state.go("tab.friends");
    };
    $scope.onFriendsCircle = function() {
        $state.go("friendsCircle");
    };
})

.controller('messageCtrl', function($scope, $state, $ionicPopup, localStorageService, messageService,$timeout) {

    $scope.onSwipeLeft = function() {
        $state.go("tab.friends");
    };
    $scope.popupMessageOpthins = function(message) {
        $scope.popup.index = $scope.messages.indexOf(message);
        $scope.popup.optionsPopup = $ionicPopup.show({
            templateUrl: "templates/popup.html",
            scope: $scope
        });
        $scope.popup.isPopup = true;
    };
    $scope.markMessage = function() {
        var index = $scope.popup.index;
        var message = $scope.messages[index];
        if (message.showHints) {
            message.showHints = false;
            message.noReadMessages = 0;
        } else {
            message.showHints = true;
            message.noReadMessages = 1;
        }
        $scope.popup.optionsPopup.close();
        $scope.popup.isPopup = false;
        messageService.updateMessage(message);
    };
    $scope.deleteMessage = function() {
        var index = $scope.popup.index;
        var message = $scope.messages[index];
        $scope.messages.splice(index, 1);
        $scope.popup.optionsPopup.close();
        $scope.popup.isPopup = false;
        messageService.deleteMessageId(message.id);
        messageService.clearMessage(message);
    };
    $scope.topMessage = function() {
        var index = $scope.popup.index;
        var message = $scope.messages[index];
        if (message.isTop) {
            message.isTop = 0;
        } else {
            message.isTop = new Date().getTime();
        }
        $scope.popup.optionsPopup.close();
        $scope.popup.isPopup = false;
        messageService.updateMessage(message);
    };
    $scope.messageDetils = function(message) {
        $state.go("messageDetail", {
            "messageId": message.id
        });
    };
    $scope.$on("$ionicView.beforeEnter", function(){
        $scope.messages = messageService.getAllMessages();
      console.log($scope.messages);
        $scope.popup = {
            isPopup: false,
            index: 0
        };
    });
    $scope.doRefresh = function() {
        // console.log("ok");
        //$scope.messageNum += 5;
        $timeout(function() {
            $scope.messages = messageService.getAllMessages();
            $scope.$broadcast('scroll.refreshComplete');
        }, 200);
    };

})

.controller('friendsCtrl', function($scope, $state) {
    $scope.onSwipeLeft = function() {
        $state.go("tab.find");
    };
    $scope.onSwipeRight = function() {
        $state.go("tab.message");
    };
    $scope.contacts_right_bar_swipe = function(e){
        console.log(e);
    };
})

.controller('settingCtrl', ['$scope','$state','userService','$http',
    function($scope, $state,userService,$http) {
        $scope.onSwipeRight = function() {
            $state.go("tab.find");
        };
      $scope.onMasterInfo=function() {
        $state.go("masterInfo");
      };
        $scope.$on("$ionicView.beforeEnter", function() {

        });
        $http.get("data/json/userinfo.json").then(function(response){
                $scope.userinfos=response.data.userinfo;
            });
    }
])

.controller('friendsCircleCtrl', ['$scope','$state','$http','$timeout',
    function($scope, $state,$http,$timeout) {
        $scope.$on("$ionicView.beforeEnter", function() {

        });
        $scope.doRefresh=function() {
          $timeout(function(){
            $http.get("data/json/circlestates.json").then(function(response){
              $scope.circlestates=response.data.circlestates;
              $scope.$broadcast('scroll.refreshComplete');
            });
          },200);
        };

        $http.get("data/json/circlestates.json").then(function(response){
                $scope.circlestates=response.data.circlestates;
            });
        $http.get("data/json/userinfo.json").then(function(response){
                $scope.userinfos=response.data.userinfo;
            });
    }
])

.controller('messageDetailCtrl', ['$scope', '$stateParams',
    'messageService', '$ionicScrollDelegate', '$timeout','dateService',
    function($scope, $stateParams, messageService, $ionicScrollDelegate, $timeout,dateService) {
        var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');

        $scope.doRefresh = function() {
            $scope.messageNum += 5;
            $timeout(function() {
                $scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
                    $stateParams.messageId);
                $scope.$broadcast('scroll.refreshComplete');
            }, 200);
        };

        $scope.$on("$ionicView.beforeEnter", function() {
            $scope.message = messageService.getMessageById($stateParams.messageId);
            $scope.message.noReadMessages = 0;
            $scope.message.showHints = false;
            messageService.updateMessage($scope.message);
            $scope.messageNum = 10;
            $scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
                $stateParams.messageId);
            $timeout(function() {
                viewScroll.scrollBottom();
            }, 0);
        });
      $scope.sendMessage=function(content){
        var nowDate=dateService.getNowDate();
        var send_content={
          "isFromeMe": true,
          "content": content,
          "time": nowDate.year+'-'+nowDate.month+'-'+nowDate.day+' '+nowDate.hour+':'+nowDate.minute+':'+nowDate.second
        };
        $scope.messageDetils.push(send_content);
        console.log($scope.messageDetils);
        viewScroll.scrollBottom();
        $scope.send_content="";
      };

        window.addEventListener("native.keyboardshow", function(e){
          console.log("keyboardShow");
            viewScroll.scrollBottom();
        });
    }
])
.controller('searchCtrl', ['$scope','$state','$ionicHistory',
  function($scope, $state,$ionicHistory) {
    $scope.goBack = function() {
      $ionicHistory.backView();
      $ionicHistory.goBack();
    };
    $scope.$on("$ionicView.beforeEnter", function() {
      $scope.messages = messageService.getAllMessages();
      console.log($scope.messages);
      $scope.userinfo = response.data.userinfo;

    });
  }
])
.controller('masterInfoCtrl',
  function($scope, $state,$ionicHistory,$http,$ionicPopup) {
    $scope.goBack = function () {
      $ionicHistory.backView();
      $ionicHistory.goBack();
    };
    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.popup = {
        isPopup: false
      };
    });
    $http.get("data/json/userinfo.json").then(function (response) {
      $scope.userinfos = response.data.userinfo;
    });

    $scope.genderPopup = function () {
      $scope.popup.optionsPopup = $ionicPopup.show({
        templateUrl: "templates/setting/gender-popup.html",
        scope: $scope
      });
      $scope.popup.isPopup = true;
    };
    $scope.genderToggle=function(value){
      $scope.popup.optionsPopup.close();
      $scope.popup.isPopup = false;
      if(value==1){
        $scope.userinfos[0].gender="男"
      }else {
        $scope.userinfos[0].gender = "女"
      }
    }
  }

);
