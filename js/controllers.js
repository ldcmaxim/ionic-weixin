angular.module('weixin.controllers', [])

//搜索模块
.controller('searchCtrl', function($scope, $state,$ionicHistory,$ionicViewSwitcher,messageService) {
    $scope.goBack = function() {
        if($ionicHistory.backView()){
            $ionicHistory.goBack();
            $ionicViewSwitcher.nextDirection("back");
        }
    };

    $scope.$on("$ionicView.beforeEnter", function() {
        $scope.messages = messageService.getAllMessages();
        angular.element(document.querySelector("#search")).attr("autofocus",true);
    });
  }
)
/* --------分割线-------*/

//消息模块
.controller('messageCtrl', function($scope, $state, $ionicPopup, localStorageService, messageService,$timeout,$ionicViewSwitcher) {
    $scope.onSwipeLeft = function() {
        $state.go("tab.friend");
        $ionicViewSwitcher.nextDirection("forward");
    };

    $scope.popupMessageOpthins = function(message) {
        $scope.popup.index = $scope.messages.indexOf(message);
        $scope.popup.optionsPopup = $ionicPopup.show({
            templateUrl: "templates/message/popup.html",
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
        $ionicViewSwitcher.nextDirection("forward");
    };
    $scope.$on("$ionicView.beforeEnter", function(){
        $scope.messages = messageService.getAllMessages();
        $scope.popup = {
            isPopup: false,
            index: 0
        };
    });

    $scope.doRefresh = function() {
        $timeout(function() {
            $scope.messages = messageService.getAllMessages();
            $scope.$broadcast('scroll.refreshComplete');
        }, 200);
    };
})
//消息详情页
.controller('messageDetailCtrl', function($scope, $stateParams, messageService, $ionicScrollDelegate, $timeout,dateService,localStorageService) {
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
      console.log($scope.messageDetils);
        $timeout(function() {
            viewScroll.scrollBottom();
        }, 0);
    });
    //以中文？开头则为对方发送，否则为自己发送
    $scope.sendMessage=function(content){
        var nowDate=dateService.getNowDate();
      var date=new Date;
        var send_message;
        var isFromMe=true;
      var send_time=nowDate.year+'-'+(nowDate.month+1)+'-'+nowDate.day+' '+nowDate.hour+':'+nowDate.minute+':'+nowDate.second;
        //如果以中文？开头则视为对方发送
        if(/^\？/g.test(content)){
            content=content.replace(/^\？{1}/g,"");
            isFromMe=false;
        }
        send_message={
          "isFromeMe": isFromMe,
          "content": content,
          "time": send_time
        };
        $scope.messageDetils.push(send_message);
        viewScroll.scrollBottom();
        $scope.send_content="";
      $scope.message.message=$scope.messageDetils;
      $scope.message.lastMessage= {
        "originalTime": send_time,
          "time": "",
          "timeFrome1970": date.getTime(),
          "content": content,
          "isFromeMe": isFromMe
      };
      localStorageService.update("message_"+$stateParams.messageId,$scope.message);

    };
    //监听键盘弹出事件，键盘弹出，viewScroll滚动至底部
    window.addEventListener("native.keyboardshow", function(e){
        console.log("keyboardShow");
        viewScroll.scrollBottom();
    });
  }
)
/* --------分割线-------*/

//通讯录模块
.controller('friendCtrl', function($scope, $state,$ionicViewSwitcher) {
    $scope.onSwipeLeft = function() {
        $state.go("tab.find");
        $ionicViewSwitcher.nextDirection("forward");
    };
    $scope.onSwipeRight = function() {
        $state.go("tab.message");
        $ionicViewSwitcher.nextDirection("back");
    };
    $scope.contacts_right_bar_swipe = function(e){
        console.log(e);
    };
  $scope.$on("$ionicView.beforeEnter", function(){
    console.log("ready");
  });
})
/* --------分割线-------*/

//发现模块
.controller('findCtrl', function($scope, $state,$ionicViewSwitcher) {
    $scope.onSwipeLeft = function() {
        $state.go("tab.setting");
        $ionicViewSwitcher.nextDirection("forward");
    };
    $scope.onSwipeRight = function() {
        $state.go("tab.friend");
        $ionicViewSwitcher.nextDirection("back");
    };
    $scope.onFriendsCircle = function() {
        $state.go("friendsCircle");
        $ionicViewSwitcher.nextDirection("forward");
        //或者标签上设置nav-direction="back"/"forward"
    };
})
//朋友圈
.controller('friendsCircleCtrl', function($scope, $state,$http,$timeout,userInfoService,friendCircleService,$ionicViewSwitcher) {
    $scope.$on("$ionicView.beforeEnter", function() {
      var master="master";
      $scope.masterinfo=userInfoService.getUserInfoById(master);
      $scope.circlestates=friendCircleService.getCircleState();
      //console.log($scope.circlestates);
    });
    $scope.doRefresh=function() {
        $timeout(function(){
            $http.get("data/json/circlestates.json").then(function(response){
              friendCircleService.init(response.data.circlestates);
            });
          $scope.circlestates=friendCircleService.getCircleState();
          $scope.$broadcast('scroll.refreshComplete');
        },200);
    };
  }
)
 /* --------分割线-------*/

//设置模块
.controller('settingCtrl', function($scope, $state,userInfoService,$http,$ionicViewSwitcher) {
        $scope.$on("$ionicView.beforeEnter", function() {
          var master="master";
          $scope.masterinfo=userInfoService.getUserInfoById(master)
        });
        $scope.onSwipeRight = function() {
            $state.go("tab.find");
            $ionicViewSwitcher.nextDirection("back");
        };
        $scope.onMasterInfo=function() {
            $state.go("masterInfo");
            $ionicViewSwitcher.nextDirection("forward");
        };
        $scope.openWeibo=function(){
            window.open("http://weibo.com/rockmist","_system");
        };
    }
)
  //登录用户信息页
.controller('masterInfoCtrl', function($scope, $state,$ionicHistory,$http,$ionicPopup,userInfoService) {
    $scope.$on("$ionicView.beforeEnter", function () {
      var master="master";
      $scope.masterinfo=userInfoService.getUserInfoById(master)
        $scope.popup = {
          isPopup: false
        };

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
            $scope.masterinfo.gender="男";
        }else {
            $scope.masterinfo.gender = "女";
        }
    }
  }
)
/* --------分割线-------*/







