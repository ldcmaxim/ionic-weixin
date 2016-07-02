angular.module('weixin.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("tab", {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
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
            url: '/messageDetail/:messageId',
            templateUrl: "templates/message-detail.html",
            controller: "messageDetailCtrl"
        })
        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/tab-friends.html',
                    controller: "friendsCtrl"
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
            url: '/friendsCircle',
            templateUrl: 'templates/friends-circle.html',
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
        .state('search', {
            url: '/search',
            templateUrl: 'templates/search.html',
            controller: "searchCtrl"
        })
        .state('masterInfo', {
            url: '/masterInfo',
            templateUrl: 'templates/masterInfo.html',
            controller: "masterInfoCtrl"
        });

    $urlRouterProvider.otherwise("/tab/message");
});
