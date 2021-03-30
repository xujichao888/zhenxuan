/* jshint esversion: 6 */
function formatNumber (n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime (date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join('/');
  const t2 = [hour, minute, second].map(formatNumber).join(':');

  return `${t1} ${t2}`;
}

export const setNavBarHeight = self => {
  wx.getSystemInfo({
    success (system) {
        // eslint-disable-next-line no-console
        // console.log(`system:`, system);
        console.log(system);
        if (system.model.indexOf('iPhone X') > -1) {
          self.$store.commit('setIsIphoneX', true)
        } else {
          self.$store.commit('setIsIphoneX', false)
        }
        self.statusBarHeight = system.statusBarHeight;
        self.system = system.system;

        let platformReg = /ios/i;
        if (platformReg.test(system.system)) {
            self.titleBarHeight = 44;
        } else {
            self.titleBarHeight = 48;
        }
        self.navBarHeight = self.statusBarHeight;
    },
  });
};

export const countDown = (endTime, now) => {
  let entTimeTime = 0
  if (/-/g.test(endTime)) {
    const endTimeArr = endTime.replace(/-/g, '/')
    entTimeTime = +new Date(endTimeArr)
  } else {
    entTimeTime = endTime
  }
  let newTime
  if(now) newTime = +new Date(now)
  else newTime = +new Date()
  let cuntDownTime = entTimeTime - newTime
  if (cuntDownTime < 0) {
    return {
      day: 0,
      hourText: '00',
      minuteText: '00',
      secondText: '00',
    }
  } else {
    const time = Math.floor(cuntDownTime / 1000)
    const day = Math.floor(time / (3600 * 24))
    const hour = Math.floor((time - 24 * day * 3600) / 3600)
    const minute = Math.floor((time - hour * 3600 - 24 * day * 3600) / 60)
    const second = Math.floor(time - hour * 3600 - minute * 60 - 24 * day * 3600)
    const hourText = hour < 10 ? `0${hour}` : hour 
    const minuteText = minute < 10 ? `0${minute}` : minute 
    const secondText = second < 10 ? `0${second}` : second
    return {
      day,
      hourText,
      minuteText,
      secondText,
    }
  }
}

// 生成随机数
export const guid = () => {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, (c) => {
    console.log(c);
    const r = Math.random() * 36 | 0
    const v = r
    return v.toString(36)
  })
}

export const accMul = (arg1,arg2) => {
  let m=0,s1=arg1.toString(),s2=arg2.toString();  
  try{m+=s1.split(".")[1].length}catch(e){}  
  try{m+=s2.split(".")[1].length}catch(e){}  
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
}

export const twoDecimals = number => {
  return number.toFixed(2)
}

export default {
  formatNumber,
  formatTime,
  setNavBarHeight,
  countDown,
  guid,
  twoDecimals,
};
