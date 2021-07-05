/*
==========================Quantumultx=========================
[task_local]
#依云约课
5 6-18/6 * * * jd_fruit.js, tag=依云约课, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdnc.png, enabled=true
=========================Loon=============================

*/
const $ = new Env('依云约课');
const notify = $.isNode() ? require('./sendNotify') : '';

let cookie = '',mainnaviId = '',schedulesList = [],isContinue=true,schedulesHisList = [];
if ($.isNode()) {
    if (process.env.YI_YUN_CK){
        cookie = process.env.YI_YUN_CK
    }
} else {
    cookie = $.getdata('YI_YUN_CK')
}

!(async () => {
    //获取基本信息
    await getBaseInfo();
    if($.isLogin){
        //获取所有课程
        await getAllClass();

        //预约历史，最多10页
        for(var i = 0;i < 10 ;i++){
            if(!isContinue){
                break
            }
            await getCourHistory(i + 1);
        }
        isContinue = true
        //取消历史，最多10页
        for(var i = 0;i < 10 ;i++){
            if(!isContinue){
                break
            }
            await getCourCanHistory(i + 1);
        }

        //获取课程信息
        if(schedulesList){
            for(var i = 0;i < schedulesList.length;i++){
                for(var j = 0;j < schedulesList[i].length;j++){
                    if(schedulesList[i][j] && schedulesList[i][j].scheduleId){
                        //已预约或已取消的跳过
                        for(var k = 0;k < schedulesHisList.length;k++){
                            var schedulesHis = schedulesHisList[k]
                            if(schedulesList[i][j].startTime == schedulesHis.courseDate
                                && schedulesHis.courseName == schedulesList[i][j].courseName
                                && schedulesHis.roomName == schedulesList[i][j].roomName){
                                console.log("日期：" + schedulesHis.courseDate + "，课程：" + schedulesHis.courseName + "已经预约或取消，跳过循环")
                                continue
                            }else{
                                await getCoachInfos(schedulesList[i][j]);
                                //预约课程
                                console.log("日期：" + schedulesHis.courseDate + "，课程：" + schedulesHis.courseName + ",开始预约课程")
                                await subscribe(schedulesList[i][j]);
                            }
                        }

                    }else{
                        console.log(schedulesList[i][j].courseName + "无课程id")
                    }
                }
            }
        }
    }else{
        console.log("未登录")
        notify.sendNotify(`瑜伽预约提醒`, "CK失效");
    }

})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

async function getCourCanHistory(page) {
    return new Promise(async resolve => {
        var body = {
            "startTime" : null,
            "currPage" : page,
            "endTime" : null,
            "listType" : 1,
            "pageSize" : 100
        }
        const options = {
            "url": `https://mapp.easy-hi.com/m/api/yg/customer/SubscribeController/getMySubscriptions`,
            'body': `${JSON.stringify(body)}`,
            "headers": {
                "Host":"mapp.easy-hi.com",
                "Origin":"https://mapp.easy-hi.com",
                "Accept": "application/json,text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Content-Type":"application/json;charset=utf-8",
                "Referer": "https://mapp.easy-hi.com/m/2106739369/cust",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data && data.code == 0) {
                            data = data.data
                            var items = data.items
                            if(items && items.length > 0){
                                for(var i = 0;i < items.length;i++){
                                    schedulesHisList.push(items[i])
                                }
                            }
                            return
                        }
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

async function getCourHistory(page) {
    return new Promise(async resolve => {
        var body = {
            "startTime" : null,
            "currPage" : page,
            "endTime" : null,
            "listType" : 1,
            "pageSize" : 100
        }
        const options = {
            "url": `https://mapp.easy-hi.com/m/api/yg/customer/SubscribeController/getMySubscriptions`,
            'body': `${JSON.stringify(body)}`,
            "headers": {
                "Host":"mapp.easy-hi.com",
                "Origin":"https://mapp.easy-hi.com",
                "Accept": "application/json,text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Content-Type":"application/json;charset=utf-8",
                "Referer": "https://mapp.easy-hi.com/m/2106739369/cust",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data && data.code == 0) {
                            data = data.data
                            var items = data.items
                            if(items && items.length > 0){
                                for(var i = 0;i < items.length;i++){
                                    schedulesHisList.push(items[i])
                                }
                            }
                            return
                        }
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

async function subscribe(item) {
    return new Promise(async resolve => {
        var body = {
            "discountValue" : item.discountValue,
            "deductValue" : item.deductValue,
            "userCardId" : item.userCardId,
            "coachId" : item.coachId,
            "subscribeNum" : 1,
            "cardType" : item.cardType,
            "endTime" : item.endTime,
            "seats" : null,
            "scheduleId" : item.scheduleId,
            "subscribeType" : "1",
            "startTime" : item.startTime,
            "agree" : false
        }
        const options = {
            "url": `https://mapp.easy-hi.com/m/api/yg/customer/SubscribeController/confirmQueue`,
            'body': `${JSON.stringify(body)}`,
            "headers": {
                "Host":"mapp.easy-hi.com",
                "Origin":"https://mapp.easy-hi.com",
                "Accept": "application/json,text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Content-Type":"application/json;charset=utf-8",
                "Referer": "https://mapp.easy-hi.com/m/2106739369/cust",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data && data.code == 0) {
                            console.log("日期：" + item.startTime + "，课程：" + item.courseName + "预约成功")
                            notify.sendNotify(`瑜伽预约提醒`, "日期：" + item.startTime + "，课程：" + item.courseName + "预约成功");
                            return
                        }else{
                            console.log("日期：" + item.startTime + "，课程：" + item.courseName + "预约失败，原因：" + data.message)
                            notify.sendNotify(`瑜伽预约提醒`, "日期：" + item.startTime + "，课程：" + item.courseName + "预约失败，原因：" + data.message);
                        }
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
async function getCoachInfos(item) {
    return new Promise(async resolve => {
        var body = {
            "subscribeType" : "1",
            "scheduleId" : item.scheduleId,
            "duration" : null
        }
        const options = {
            "url": `https://mapp.easy-hi.com/m/api/yg/customer/SubscribeController/index`,
            'body': `${JSON.stringify(body)}`,
            "headers": {
                "Host":"mapp.easy-hi.com",
                "Origin":"https://mapp.easy-hi.com",
                "Accept": "application/json,text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Content-Type":"application/json;charset=utf-8",
                "Referer": "https://mapp.easy-hi.com/m/2106739369/cust",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['cards'] && data['schedule']) {
                            var cards = data['cards']
                            var schedule = data['schedule']
                            item.discountValue = cards[0].discountValue
                            item.deductValue = cards[0].deductValue
                            item.userCardId = cards[0].userCardId
                            item.cardType = cards[0].cardType
                            item.coachId = schedule.coachId
                            item.startTime = schedule.startTime
                            item.endTime = schedule.endTime
                            item.scheduleId = schedule.scheduleId
                            return
                        }
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

async function getAllClass() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://mapp.easy-hi.com/m/api/yg/customer/ScheduleIndexController/index`,
            'body': '{"courseType":null}',
            "headers": {
                "Host":"mapp.easy-hi.com",
                "Origin":"https://mapp.easy-hi.com",
                "Accept": "application/json,text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Content-Type":"application/json;charset=utf-8",
                "Referer": "https://mapp.easy-hi.com/m/2106739369/cust",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['schedules']) {
                            var schedules = data['schedules']
                            if(schedules){
                                schedules = new Map(Object.entries(schedules))
                                schedules.forEach((item,index) => {
                                    schedulesList.push(item)
                                })
                            }
                            return
                        }
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

async function getBaseInfo() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://mapp.easy-hi.com/m/api/base/IndexController/index`,
            "headers": {
                "Host":"mapp.easy-hi.com",
                "Origin":"https://mapp.easy-hi.com",
                "Accept": "application/json,text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Referer": "https://mapp.easy-hi.com/m/2106739369/cust",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['userName'] && data['userName'] != "") {
                            console.log('当前账号：' + data['userName']);
                            var mainnavis = data['mainnavis']
                            if(mainnavis){
                                mainnavis.forEach((item,index) => {
                                    if(item.mainnaviName == "预定"){
                                        mainnaviId = item.mainnaviId
                                    }
                                })
                            }
                            $.isLogin = true;
                            return
                        }else{
                            $.isLogin = false;
                        }
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
