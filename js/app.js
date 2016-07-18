// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('weixin', ['ionic', 'weixin.controllers', 'weixin.routes',
    'weixin.services', 'weixin.directives', 'monospaced.elastic','ngAnimate'
])

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}])

.run(function($ionicPlatform, $http,localDataService, $ionicHistory,$ionicPopup,$location,$ionicViewSwitcher) {
    var isWebView = ionic.Platform.isWebView();
    console.log("isWebView:"+isWebView);
    if(localStorage.messageID&&localStorage.userID&&localStorage.stateID){
      console.log("localStorage is saved");
    }else{
      localDataService.init();
    }
    console.log(localStorage);


    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (ionic.Platform.isAndroid()&&isWebView) {
            window.navigator.splashscreen.hide();
        }
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
  $ionicPlatform.registerBackButtonAction(function (e) {
    e.preventDefault();
    // 回到首页则选择是否退出app?
    if ($location.path() == '/tab/message'||$location.path() == '/tab/friends'||$location.path() == '/tab/find'
      ||$location.path() == '/tab/setting') {
      showConfirm();
    } else if ($ionicHistory.backView()) {
      // Go back in history
      $ionicHistory.goBack();
      $ionicViewSwitcher.nextDirection("back");
    } else {
      // This is the last page: Show confirmation popup
      showConfirm();
    }
    function showConfirm() {
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>退出应用?</strong>',
        template: '你确定要退出应用吗?',
        okText: '退出',
        cancelText: '取消'
      });
      confirmPopup.then(function (res) {
        if (res) {
          ionic.Platform.exitApp();
        } else {
          // Don't close
        }
      });
    }
    return false;
  }, 101);

});
