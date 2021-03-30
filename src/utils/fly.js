
/* jshint esversion: 6 */
import store from '@/store'
const host = store.state.baseUrl //'https://api.jixiangyanxuan.com'//'http://api.jx78.com';
const {nodeNameType} = store.state
console.log(nodeNameType)
let channelValue = ''
switch(nodeNameType){
  case 'wxjx':
    channelValue = 'zhenxuan'
    break;
  case 'wxjx2':
    channelValue = 'jingxuan'
    break;
  case 'wxjx3':
    channelValue = 'linxuan'
    break;
  case 'wxjx4':
      channelValue = 'caixuan'
      break;
  case 'wxjx5':
        channelValue = 'suxing'
        break;
  case 'wxjx6':
          channelValue = 'susu'
        break;
  case 'wxjx7':
            channelValue = 'tiaoxuan'
        break;
  case 'wxjx8':
          channelValue = 'haowu'
      break;
  case 'wxjx9':
        channelValue = 'jicui'
    break;
  default:
    channelValue = ''
    break
}

const request = (url, method, data, responseType) => {
  const headers = {
    'content-type': 'application/json', // 默认转为json格式
    'channel' : channelValue
  }
  let token = '';
  try {
    token = wx.getStorageSync('token')
    if (token) {
      headers['token'] = token
    }
  } catch (error) {
    console.log(error);
  }
  try {
    let userID = ''
    userID = wx.getStorageSync('userid')
    if (userID) {
      headers['userid'] = userID
    }
  } catch (error) {
    console.log(error);
  }

  try {
    let leader = store.state.leader * 1
    if (leader > 0) {
      headers['leader'] = leader
    }
  } catch (error) {
    console.log(error);
  }

  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    wx.request({
      timeout: 20000,
      url: url.indexOf('http') > - 1 ? url : host + url,
      method: method,
      data: data,
      header: headers,
      responseType: responseType || 'text',
      success: function (res) {
        setTimeout(() => {
          wx.hideLoading()
        }, 500)
        resolve(res.data);
      },
      fail: function (error) {
        setTimeout(() => {
          wx.hideLoading()
          wx.showToast({
            title: error.errMsg,
            icon: 'none',
            mask: true,
          })
        }, 500)
        console.log(error);
        reject(false);
      },
      complete: function () {
        setTimeout(() => {
          wx.hideLoading()
        }, 500)
      },
    });
  });
};

const get = (obj, responseType) => {
  return request(obj.url, 'GET', obj.data, responseType);
};

const post = (obj, responseType) => {
  return request(obj.url, 'POST', obj.data, responseType);
};

export default {
  request,
  get,
  post,
};
