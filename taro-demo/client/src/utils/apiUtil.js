import Mmd5 from './Mmd5'
import rsaObj from './rsa_common'
import Base64 from './base64'
import APIS from '../constants/apis'

const loginRequestUrl = APIS.LOGIN_REQUEST

// var app = getApp()
// ajax(rul,type,data,请求头，回调)
function wxAjax (url, requestType, data, header, callback) {
  wx.request({
    url: loginRequestUrl + url,
    data: data,
    method: requestType,
    header: header, //  设置请求的 header
    success: function (res) {
      data = res.data
      data.wxStatus = 'success'
    },
    fail: function (error) {
      data = {}
      data.wxStatus = 'fail'
    },
    complete: function () {
      callback(data)
    }
  })
}

// ajax(appid,wxVersion,returnpage,请求头)
function wxapp_login (guid, lsid, ptPin, ptKey, appid, wxVersion, returnpage, isJdLogin, callback) {
  var startTime = new Date()
  wx.login({
    success: function (radata) {
      if (radata.code) {
        var encryptedData = ''
        var ivData = ''
        var endTime = 0
        var cookieStr = ''
        wx.getUserInfo({
          success: function (resInfo) {
            endTime = new Date()
            encryptedData = encodeURIComponent(resInfo.encryptedData)
            ivData = encodeURIComponent(resInfo.iv)
          },
          fail: function () {
            endTime = new Date()
            encryptedData = ''
            ivData = ''
          },
          complete: function () {
            if (endTime - startTime < 2000 && !isJdLogin) {
              cookieStr = 'guid=' + guid + '; lsid=' + lsid + '; pt_pin=' + ptPin + '; pt_key=' + ptKey + '; code=' + radata.code + '; data=' +
                encryptedData + '; iv=' + ivData
            } else {
              cookieStr = 'guid=' + guid + '; lsid=' + lsid + '; pt_pin=' + ptPin + '; pt_key=' + ptKey
            }
            var header = {
              'cookie': cookieStr
            }
            wxAjax('/cgi-bin/wx/wxapp_login?appid=' + appid + '&returnpage=' + returnpage + '&wxVersion=' + wxVersion, 'GET', '', header,
              function (data) {
                callback(data)
              })
          }
        })
      }
    }
  })
}

function wxapp_dologin (guid, lsid, ptPin, ptKey, ptToken, username, password, s_token, authcode, rsa_modulus, callback) {
  rsaObj.setMaxDigits(131)
  var key = new rsaObj.RSAKeyPair('3', '10001', rsa_modulus, 1024)
  var rsaStr = rsaObj.encryptedString(key, password, rsaObj.RSAAPP.PKCS1Padding, rsaObj.RSAAPP.RawEncoding)
  var rsa_pwd = Base64.encode(rsaStr)
  var jsonData = {
    username: username,
    pwd: rsa_pwd,
    s_token: s_token,
    authcode: authcode
  }
  var strData = jsonSerialize(jsonData)
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid + '; pt_pin=' + ptPin + '; pt_key=' + ptKey + '; pt_token=' + ptToken
  }
  wxAjax('/cgi-bin/wx/wxapp_dologin', 'POST', strData, header, function (data) {
    callback(data)
  })
}

function smslogin (guid, lsid, ptKey, appid, code, wxversion, encryptedData, ivData, callback) {
  var jsonData = {
    code: code,
    user_data: encryptedData,
    user_iv: ivData
  }
  var strData = jsonSerialize(jsonData)

  var url = '/cgi-bin/login/smslogin?appid=' + appid + '&wxversion=' + wxversion
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid + '; pt_key=' + ptKey
  }
  wxAjax(url, 'POST', strData, header, function (data) {
    callback(data)
  })
}

function smslogin_sendmsg (guid, lsid, appid, phoneNumber, callback) {
  var url = '/cgi-bin/login/smslogin_sendmsg?appid=' + appid + '&mobile=' + phoneNumber
  var header = {
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax(url, 'GET', '', header, function (data) {
    callback(data)
  })
}

function dosmslogin (guid, lsid, mobileNumber, msgcode, callback) {
  var jsonData = {
    mobile: mobileNumber,
    smscode: msgcode
  }
  var strData = jsonSerialize(jsonData)
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/cgi-bin/login/dosmslogin', 'POST', strData, header, function (res) {
    callback(res)
  })
}

function wxapp_reg (guid, lsid, returnpage, appid, callback) {
  var header = {
    Cookie: 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/cgi-bin/wx/wxapp_reg?appid=' + appid + '&returnpage=' + returnpage, 'GET', '', header, function (data) {
    callback(data)
  })
}

function docheckphone (guid, lsid, phoneNumber, s_token, imgInput, callback) {
  var authcode = imgInput || ''
  var jsonData = {
    mobile: phoneNumber,
    s_token: s_token,
    authcode: authcode
  }
  var strData = jsonSerialize(jsonData)
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/cgi-bin/wx/docheckphone', 'POST', strData, header, function (data) {
    callback(data)
  })
}

function dosendmsgcode (guid, lsid, phoneNumber, s_token, callback) {
  var paramData = {
    mobile: phoneNumber,
    s_token: s_token,
    is_unbind: 0
  }
  var strParam = jsonSerialize(paramData)
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/cgi-bin/wx/docheckphone', 'POST', strParam, header, function (data) {
    callback(data)
  })
}

function wxapp_doreg (guid, lsid, rsa_modulus, password, mobileNumber, s_token, msgcode, callback) {
  rsaObj.setMaxDigits(131)
  var key = new rsaObj.RSAKeyPair('3', '10001', rsa_modulus, 1024)
  var rsaStr = rsaObj.encryptedString(key, password, rsaObj.RSAAPP.PKCS1Padding, rsaObj.RSAAPP.RawEncoding)
  var rsa_pwd = Base64.encode(rsaStr)
  var jsonData = {
    mobile: mobileNumber,
    pwd: rsa_pwd,
    s_token: s_token,
    checkcode: msgcode
  }
  var strData = jsonSerialize(jsonData)
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/cgi-bin/wx/wxapp_doreg', 'POST', strData, header, function (res) {
    callback(data)
  })
}

function wxapp_loginbind (guid, lsid, callback) {
  var cookieStr = 'guid=' + guid + '; lsid=' + lsid
  var header = {
    'cookie': cookieStr
  }
  wxAjax('/cgi-bin/wx/wxapp_loginbind', 'GET', '', header, function (res) {
    callback(res)
  })
}

function wxapp_dologinbind (guid, lsid, username, password, wx_token, authcode, rsa_modulus, callback) {
  rsaObj.setMaxDigits(131)
  var key = new rsaObj.RSAKeyPair('3', '10001', rsa_modulus, 1024)
  var rsaStr = rsaObj.encryptedString(key, password, rsaObj.RSAAPP.PKCS1Padding, rsaObj.RSAAPP.RawEncoding)
  var rsa_pwd = Base64.encode(rsaStr)

  var jsonData = {
    lsid: lsid,
    guid: guid,
    username: username,
    pwd: rsa_pwd,
    wx_token: wx_token,
    authcode: authcode
  }
  var strData = jsonSerialize(jsonData)
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/cgi-bin/wx/wxapp_dologinbind', 'POST', strData, header, function (res) {
    callback(res)
  })
}

function goBack (data) {
  if (data.fromPageType && data.fromPageType === 'switchTab') {
    wx.switchTab({
      url: data.returnpage
    })
  } else if (data.fromPageType && data.fromPageType === 'h5') {
    h5Jump(data.returnpage)
  } else {
    var arrpageShed = Taro.getCurrentPages()
    // var strCurrentPage = '/' + arrpageShed[arrpageShed.length - 1].__route__
    var pageIndex = -1
    var returnpageOrigin = data.returnpage
    if (data.returnpage.indexOf('?') >= 0) {
      returnpageOrigin = data.returnpage.substr(0, data.returnpage.indexOf('?'))
    }
    arrpageShed.forEach((pageItem, index) => {
      if (returnpageOrigin === '/' + pageItem.__route__) {
        pageIndex = index
      }
    })
    if (pageIndex >= 0) {
      (data.returnpage.indexOf('index') > -1) && wx.setStorageSync('isLoginBack', true)
      wx.navigateBack({
        delta: arrpageShed.length - pageIndex - 1
      })
    } else {
      wx.redirectTo({
        url: data.returnpage
      })
    }
  }
}

function h5Jump (page) {
  var returnData = {}
  var ptKey = wx.getStorageSync('jdlogin_pt_key') || '', // 登录状态
    guid = wx.getStorageSync('jdlogin_guid') || '', // 登录状态
    lsid = wx.getStorageSync('jdlogin_lsid') || '', // 登录状态
    appid = 333, //  wx.getStorageSync('appid'),
    ts = parseInt(new Date() / 1000),
    h5Data = 'appid=' + appid + '&pt_key=' + ptKey + '&ts=' + ts + 'dzHdg!ax0g927gYr3zf&dSrvm@t4a+8F',
    Mmd5Fun = Mmd5.Mmd5(),
    md5H5Data = Mmd5Fun.hex_md5(h5Data)

  wx.request({
    url: loginRequestUrl + '/plogin/cgi-bin/app/wxapp_gentoken',
    data: {
      appid: appid,
      ts: ts,
      sign: md5H5Data

    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': 'guid=' + guid + '; lsid=' + lsid + '; pt_key=' + ptKey
    },
    success: function (res) {
      if (res.err_code == 0) {
        var h5_url = res.url + '?to=' + encodeURIComponent(page) + '&tokenkey=' + res.tokenkey
        wx.redirectTo({
          url: '../web-view/web-view?h5_url=' + h5_url
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '页面跳转失败，请重试',
          success: function (res) {
            if (res.confirm) {
              h5Jump(page)
            }
          }
        })
      }
    },
    fail: function (res) {
      wx.showModal({
        title: '提示',
        content: '页面跳转失败，请重试',
        success: function (res) {
          if (res.confirm) {
            h5Jump(page)
          }
        }
      })
    }
  })
}

function smslogin_checkreceiver (guid, lsid, ptPin, ptKey, ptToken, mobile, receive, callback) {
  var jsonData = {
    mobile: mobile,
    receiver: receive
  }
  var strData = jsonSerialize(jsonData)
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/cgi-bin/login/smslogin_checkreceiver', 'POST', strData, header, function (res) {
    callback(res)
  })
}

function wxapp_regbindsendmsgcode (guid, lsid, phoneNumber, wx_token, callback) {
  var paramData = {
    mobile: phoneNumber,
    wx_token: wx_token
  }
  var strParam = jsonSerialize(paramData)
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/cgi-bin/wx/wxapp_regbindsendmsgcode', 'POST', strParam, header, function (res) {
    callback(res)
  })
}

function wxapp_doregbind (guid, lsid, rsa_modulus, password, wx_token, mobileNumber, msgcode, callback) {
  rsaObj.setMaxDigits(131)
  var key = new rsaObj.RSAKeyPair('3', '10001', rsa_modulus, 1024)
  var rsaStr = rsaObj.encryptedString(key, password, rsaObj.RSAAPP.PKCS1Padding, rsaObj.RSAAPP.RawEncoding)
  var rsa_pwd = Base64.encode(rsaStr)
  var jsonData = {
    wx_token: wx_token,
    mobile: mobileNumber,
    pwd: rsa_pwd,
    smscode: msgcode
  }
  var strData = jsonSerialize(jsonData)
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/cgi-bin/wx/wxapp_doregbind', 'POST', strData, header, function (res) {
    callback(res.data)
  })
}

function wxconfirmlogin (guid, lsid, wxToken, callback) {
  var data = {
    wx_token: wxToken
  }
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'guid=' + guid + '; lsid=' + lsid
  }
  wxAjax('/wxapplogin/cgi-bin/login/wxconfirmlogin', 'POST', data, header, function (res) {
    callback(res)
  })
}

function logout (appid, returnpage) {
  var guid = wx.getStorageSync('jdlogin_guid') || ''
  var lsid = wx.getStorageSync('jdlogin_lsid') || ''
  var ptPin = encodeURIComponent(wx.getStorageSync('jdlogin_pt_pin') || '')
  var ptKey = wx.getStorageSync('jdlogin_pt_key') || ''
  var ptToken = wx.getStorageSync('jdlogin_pt_token') || ''
  var cookieStr = 'guid=' + guid + '; lsid=' + lsid + '; pt_pin=' + ptPin + '; pt_key=' + ptKey + '; pt_token=' + ptToken
  var header = {
    'cookie': cookieStr
  }
  wxAjax('/cgi-bin/wx/wxapp_logout?appid=' + appid, 'GET', '', header, function (res) {
    if (res.wxStatus === 'success') {
      var data = res.data
      if (data.err_code === 0) {
        if (returnpage) {
          returnpage = encodeURIComponent(returnpage)
        } else {
          var arrpageShed = getCurrentPages()
          var strCurrentPage = '/' + arrpageShed[arrpageShed.length - 1].__route__
          returnpage = encodeURIComponent(strCurrentPage)
        }
        wx.redirectTo({
          url: '/pages/account/login/login?returnpage=' + returnpage + ''
        })
      } else {
        console.log('logout failed: ' + data.err_msg)
      }
    } else {
      console.log('logout request failed')
    }
  })
  wx.removeStorage({key: 'jdlogin_pt_key'})
  wx.removeStorage({key: 'jdlogin_pt_pin'})
  wx.removeStorage({key: 'jdlogin_pt_token'})
}

function jsonSerialize (json) {
  var str = ''
  for (var key in json) {
    str += key + '=' + encodeURIComponent(json[key]) + '&'
  }
  return str.substring(0, str.length - 1)
}

// 检测是否能登录
function checkLogin (obj) {
  var flag = true
  for (var key in obj) {
    if (!obj[key]) {
      flag = false
      return flag
    }
  }
  return flag
}

// 验证是否为手机号码
function checkPhone (phone) {
  var pattern = /^1[3-9][0-9]{9}$/
  return pattern.test(phone)
}

module.exports = {
  wxapp_login,
  wxapp_dologin,
  smslogin,
  smslogin_sendmsg,
  dosmslogin,
  wxapp_reg,
  docheckphone,
  dosendmsgcode,
  wxapp_doreg,
  wxapp_loginbind,
  wxapp_dologinbind,
  goBack,
  wxapp_regbindsendmsgcode,
  wxapp_doregbind,
  smslogin_checkreceiver,
  wxconfirmlogin,
  logout,
  jsonSerialize,
  checkPhone,
  checkLogin,
  h5Jump
}
