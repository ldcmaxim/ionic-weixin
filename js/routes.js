angular.module('weixin.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("tab", {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        .state('search', {
          url: '/search',
          templateUrl: 'templates/search.html',
          controller: "searchCtrl"
        })
        .state('tab.message', {
            url: '/message',
            views: {
                'tab-message': {
                    templateUrl: 'templates/tab-message.html',
                    controller: "messageCtrl"
                }
            }
        })
        .state('messageDetail', {
            url: 'tab/message/messageDetail/:messageId',
            templateUrl: "templates/message/message-detail.html",
            controller: "messageDetailCtrl"
        })
        .state('tab.friend', {
            url: '/friend',
            views: {
                'tab-friend': {
                    templateUrl: 'templates/tab-friend.html',
                    controller: "friendCtrl"
                }
            }
        })
        .state('tab.find', {
            url: '/find',
            views: {
                'tab-find': {
                    templateUrl: 'templates/tab-find.html',
                    controller: "findCtrl"
                }
            }
        })
        .state('friendsCircle', {
            url: '/tab/find/friendsCircle',
            templateUrl: 'templates/find/friendsCircle.html',
            controller: "friendsCircleCtrl"
        })
        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/tab-setting.html',
                    controller: "settingCtrl"
                }
            }
        })
        .state('masterInfo', {
            url: '/tab/setting/masterinfo',
            templateUrl: 'templates/setting/masterinfo.html',
            controller: "masterInfoCtrl"
        });

    $urlRouterProvider.otherwise("/tab/message");
});
