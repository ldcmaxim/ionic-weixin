angular.module('weixin.services', [])
.factory('localDataService', ['$http','messageService','userInfoService','friendCircleService',
  function($http,messageService,userInfoService,friendCircleService) {
    return {
      init:function(){
        var isWebView = ionic.Platform.isWebView();
        var url = "";
        if (ionic.Platform.isAndroid()&&isWebView) {
          url = "/android_asset/www/";
        }
        $http.get(url + "data/json/messages.json").then(function(response) {
          // localStorageService.update("messages", response.data.messages);
          messageService.init(response.data.messages);
        });
        $http.get(url + "data/json/userinfos.json").then(function(response) {
          // localStorageService.update("userinfos", response.data.userinfos);
          userInfoService.init(response.data.userinfos);
        });
        $http.get(url + "data/json/circlestates.json").then(function(response) {
          // localStorageService.update("circlestates", response.data.circlestates);
          friendCircleService.init(response.data.circlestates);
        });
      }
    };
  }])
.factory('localStorageService', [function() {
        return {
            get: function localStorageServiceGet(key, defaultValue) {
                var stored = localStorage.getItem(key);
                try {
                    stored = angular.fromJson(stored);
                } catch (error) {
                    stored = null;
                }
                if (defaultValue && stored === null) {
                    stored = defaultValue;
                }
                return stored;
            },
            update: function localStorageServiceUpdate(key, value) {
                if (value) {
                    localStorage.setItem(key, angular.toJson(value));
                }
            },
            clear: function localStorageServiceClear(key) {
                localStorage.removeItem(key);
            }
        };
}])
.factory('dateService', [function() {
    return {
        handleMessageDate: function(messages) {
            var i = 0,
                length = 0,
                messageDate = {},
                nowDate = {},
                weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                diffWeekValue = 0;
            if (messages) {
                nowDate = this.getNowDate();
                length = messages.length;
                for (i = 0; i < length; i++) {
                    messageDate = this.getMessageDate(messages[i]);
                    if(!messageDate){
                        return null;
                    }
                    if (nowDate.year - messageDate.year > 0) {
                        messages[i].lastMessage.time = messageDate.year + "";
                        continue;
                    }
                    if (nowDate.month - messageDate.month >= 0 ||
                        nowDate.day - messageDate.day > nowDate.week) {
                        messages[i].lastMessage.time = messageDate.month +
                            "月" + messageDate.day + "日";
                        continue;
                    }
                    if (nowDate.day - messageDate.day <= nowDate.week &&
                        nowDate.day - messageDate.day > 1) {
                        diffWeekValue = nowDate.week - (nowDate.day - messageDate.day);
                        messages[i].lastMessage.time = weekArray[diffWeekValue];
                        continue;
                    }
                    if (nowDate.day - messageDate.day === 1) {
                        messages[i].lastMessage.time = "昨天";
                        continue;
                    }
                    if (nowDate.day - messageDate.day === 0) {
                        messages[i].lastMessage.time = messageDate.hour + ":" + messageDate.minute;
                        continue;
                    }
                }
                // console.log(messages);
                // return messages;
            } else {
                console.log("messages is null");
                return null;
            }
        },
        getNowDate: function() {
            var nowDate = {};
            var date = new Date();
            nowDate.year = date.getFullYear();
            nowDate.month = date.getMonth();
            nowDate.day = date.getDate();
            nowDate.week = date.getDay();
            nowDate.hour = date.getHours();
            nowDate.minute = date.getMinutes();
            nowDate.second = date.getSeconds();
            return nowDate;
        },
        getMessageDate: function(message) {
            var messageDate = {};
            var messageTime = "";
            //2015-10-12 15:34:55
            var reg = /(^\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/g;
            var result = new Array();
            if (message) {
                messageTime = message.lastMessage.originalTime;
                result = reg.exec(messageTime);
                if (!result) {
                    console.log("result is null");
                    return null;
                }
                messageDate.year = parseInt(result[1]);
                messageDate.month = parseInt(result[2]);
                messageDate.day = parseInt(result[3]);
                messageDate.hour = parseInt(result[4]);
                messageDate.minute = parseInt(result[5]);
                messageDate.second = parseInt(result[6]);
                // console.log(messageDate);
                return messageDate;
            } else {
                console.log("message is null");
                return null;
            }
        }
    };
}])
.factory('messageService', ['localStorageService', 'dateService',
    function(localStorageService, dateService) {
        return {
            init: function(messages) {
                var i = 0;
                var length = 0;
                var messageID = new Array();
                var date = null;
                var messageDate = null;
                if (messages) {
                    length = messages.length;
                    for (i; i < length; i++) {
                        messageDate = dateService.getMessageDate(messages[i]);
                        if(!messageDate){
                            return null;
                        }
                        date = new Date(messageDate.year, messageDate.month,
                            messageDate.day, messageDate.hour, messageDate.minute,
                            messageDate.second);
                        messages[i].lastMessage.timeFrome1970 = date.getTime();
                        messageID[i] = {
                            id: messages[i].id
                        };

                    }
                    localStorageService.update("messageID", messageID);
                    for (i = 0; i < length; i++) {
                        localStorageService.update("message_" + messages[i].id, messages[i]);
                    }
                }
            },
            getAllMessages: function() {
                var messages = new Array();
                var i = 0;
                var messageID = localStorageService.get("messageID");
                var length = 0;
                var message = null;
                if (messageID) {
                    length = messageID.length;

                    for (i; i < length; i++) {
                        message = localStorageService.get("message_" + messageID[i].id);
                        if(message){
                            messages.push(message);
                        }
                    }
                    dateService.handleMessageDate(messages);
                    return messages;
                }
                return null;

            },
            getMessageById: function(id){
                return localStorageService.get("message_" + id);
            },
            getAmountMessageById: function(num, id){
                var messages = [];
                var message = localStorageService.get("message_" + id).message;
                var length = 0;
                if(num < 0 || !message){
                    return;
                }
                length = message.length;
                if(num < length){
                    messages = message.splice(length - num, length);
                    return messages;
                }else{
                    return message;
                }
            },
            updateMessage: function(message) {
                var id = 0;
                if (message) {
                    id = message.id;
                    localStorageService.update("message_" + id, message);
                }
            },
            deleteMessageId: function(id){
                var messageId = localStorageService.get("messageID");
                var length = 0;
                var i = 0;
                if(!messageId){
                    return null;
                }
                length = messageId.length;
                for(; i < length; i++){
                    if(messageId[i].id === id){
                        messageId.splice(i, 1);
                        break;
                    }
                }
                localStorageService.update("messageID", messageId);
            },
            clearMessage: function(message) {
                var id = 0;
                if (message) {
                    id = message.id;
                    localStorageService.clear("message_" + id);
                }
            }
        };
    }
])
.factory('userInfoService', ['localStorageService',function(localStorageService) {
  return {
      init: function(userinfos) {
        var userID=[];
        var i=0;
        var length=0;
        if(userinfos){
          length=userinfos.length;
          for(i;i<length;i++){
            localStorageService.update("user_"+userinfos[i].id,userinfos[i]);
            userID.push(
              {"id":userinfos[i].id}
            );
          }
          localStorageService.update("userID",userID);
        }
      },
    getUserInfoById: function(id) {
      var userinfo=localStorageService.get("user_"+id);
      return userinfo;
    }
  };
}])

.factory('friendCircleService', ['localStorageService','$http',function(localStorageService) {
    return {
        init:function(circleStates){
          var stateID=[];
          var i=0;
          var length=circleStates.length;
          if(circleStates){
            for(i;i<length;i++){
              localStorageService.update("state_"+circleStates[i].id,circleStates[i]);
              stateID.push(
                {"id":circleStates[i].id}
              );
            }
            localStorageService.update("stateID",stateID);
          }
        },
        getCircleState: function() {
          var stateID=localStorageService.get("stateID");
          var i=0;
          var length=stateID.length;
          var circleStates=new Array();
          for(i;i<length;i++){
            var circleState=localStorageService.get("state_"+stateID[i].id);
            circleStates.push(circleState);
          }
          return circleStates;
        }
    };
}]);
