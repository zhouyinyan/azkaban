/*
 * Copyright 2012 LinkedIn Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
// 获取url参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substring(1).match(reg)
    || window.location.hash.substring(window.location.hash.search(/\?/) + 1).match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
}

$.namespace('azkaban');

var loginView;
azkaban.LoginView = Backbone.View.extend({
  events: {
    "click #login-submit": "handleLogin",
    'keypress input': 'handleKeyPress'
  },

  initialize: function (settings) {
    $('#error-msg').hide();
  },

  handleLogin: function (evt, userValue, pwdValue) {
    console.log("Logging in.");
    var username = $("#username").val() || userValue;
    var password = $("#password").val() || pwdValue;

    $.ajax({
      async: "false",
      url: contextURL,
      dataType: "json",
      type: "POST",
      data: {
        action: "login",
        username: username,
        password: password
      },
      success: function (data) {
        if (data.error) {
          // 登录失败的时候，显示内陆也内容
          $(document.body).show();
          $('#error-msg').text(data.error);
          $('#error-msg').slideDown('fast');
        }
        else {
          document.location.reload();
        }
      }
    });
  },

  handleKeyPress: function (evt) {
    if (evt.charCode == 13 || evt.keyCode == 13) {
      this.handleLogin();
    }
  },

  render: function () {
  }
});

$(function () {
  loginView = new azkaban.LoginView({el: $('#login-form')});

  //默认隐藏登录页面内容
  $(document.body).hide();
  // 临时代码，自动登录
  loginView.handleLogin(null, getUrlParam('user') || 'azkaban', getUrlParam('pwd') || 'azkaban');
});
