/**
 * 京喜财富岛
 * 包含雇佣导游，建议每小时1次
 *
 *
 * 使用jd_env_copy.js同步js环境变量到ts
 * 使用jd_ts_test.ts测试环境变量
 */

import {format} from 'date-fns';
import axios from 'axios';
import USER_AGENT from './TS_USER_AGENTS';
import * as dotenv from 'dotenv';

const CryptoJS = require('crypto-js')

dotenv.config()
let appId: number = 10028, fingerprint: string | number, token: string, enCryptMethodJD: any;
let cookie: string = '', cookiesArr: Array<string> = [], res: any = '', shareCodes: string[] = [];

let UserName: string, index: number, isLogin: boolean, nickName: string
!(async () => {
    await requestAlgo();
    await requireConfig();

    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
        index = i + 1;
        isLogin = true;
        nickName = '';
        console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);
        await makeShareCodes();
    }

    for (let i = 0; i < cookiesArr.length; i++) {
        for (let j = 0; j < shareCodes.length; j++) {
            cookie = cookiesArr[i]
            console.log('去助力:', shareCodes[j])
            res = await api('story/helpbystage', '_cfd_t,bizCode,dwEnv,ptag,source,strShareId,strZone', {strShareId: shareCodes[j]})
            console.log(res)
            if (res.iRet === 2232 || res.sErrMsg === '今日助力次数达到上限，明天再来帮忙吧~') {
                break
            }
            await wait(3000)
        }
    }
})()

interface Params {
    strBuildIndex?: string,
    ddwCostCoin?: number,
    taskId?: number,
    dwType?: string,
    configExtra?: string,
    strStoryId?: string,
    triggerType?: number,
    ddwTriggerDay?: number,
    ddwConsumeCoin?: number,
    dwIsFree?: number,
    ddwTaskId?: string,
    strShareId?: string,
    strMarkList?: string
}

function api(fn: string, stk: string, params: Params = {}) {
    return new Promise(async resolve => {
        let url = `https://m.jingxi.com/jxbfd/${fn}?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(stk)}`
        if (['GetUserTaskStatusList', 'Award', 'DoTask'].includes(fn)) {
            console.log('api2')
            url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?strZone=jxbfd&bizCode=jxbfddch&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2`
        }
        if (Object.keys(params).length !== 0) {
            let key: (keyof Params)
            for (key in params) {
                if (params.hasOwnProperty(key))
                    url += `&${key}=${params[key]}`
            }
        }
        url += '&h5st=' + decrypt(stk, url)
        let {data} = await axios.get(url, {
            headers: {
                'Host': 'm.jingxi.com',
                'Referer': 'https://st.jingxi.com/',
                'User-Agent': USER_AGENT,
                'Cookie': cookie
            }
        })
        resolve(data)
    })
}

function makeShareCodes() {
    return new Promise<void>(async resolve => {
        let {data} = await axios.post('https://api.m.jd.com/client.action?functionId=initForFarm', `body=${escape(JSON.stringify({"version": 4}))}&appid=wh5&clientVersion=9.1.0`, {
            headers: {
                "cookie": cookie,
                "origin": "https://home.m.jd.com",
                "referer": "https://home.m.jd.com/myJd/newhome.action",
                "User-Agent": USER_AGENT,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        let farm: string = data.farmUserPro.shareCode
        res = await api('user/QueryUserInfo', '_cfd_t,bizCode,ddwTaskId,dwEnv,ptag,source,strShareId,strZone', {ddwTaskId: '', strShareId: '', strMarkList: 'undefined'})
        if(index < 6){
            console.log('助力码:', res.strMyShareId)
            shareCodes.push(res.strMyShareId)

            axios.get(`https://api.sharecode.ga/api/jxcfd/insert?code=${res.strMyShareId}&farm=${farm}`)
                .then(res => {
                    if (res.data.code === 200)
                        console.log('已自动提交助力码')
                    else
                        console.log('提交失败！已提交farm的cookie才可提交cfd')
                    resolve()
                })
                .catch(e => {
                    console.log(e)
                })
        }
    })
}

async function requestAlgo() {
    fingerprint = await generateFp();
    return new Promise(async resolve => {
        let {data} = await axios.post('https://cactus.jd.com/request_algo?g_ty=ajax', {
            "version": "1.0",
            "fp": fingerprint,
            "appId": appId,
            "timestamp": Date.now(),
            "platform": "web",
            "expandParams": ""
        }, {
            "headers": {
                'Authority': 'cactus.jd.com',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Accept': 'application/json',
                'User-Agent': USER_AGENT,
                'Content-Type': 'application/json',
                'Origin': 'https://st.jingxi.com',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://st.jingxi.com/',
                'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
            },
        })
        if (data['status'] === 200) {
            token = data.data.result.tk;
            let enCryptMethodJDString = data.data.result.algo;
            if (enCryptMethodJDString) enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
        } else {
            console.log(`fp: ${fingerprint}`)
            console.log('request_algo 签名参数API请求失败:')
        }
        resolve(200)
    })
}

function decrypt(stk: string, url: string) {
    const timestamp = (format(new Date(), 'yyyyMMddhhmmssSSS'))
    let hash1: string;
    if (fingerprint && token && enCryptMethodJD) {
        hash1 = enCryptMethodJD(token, fingerprint.toString(), timestamp.toString(), appId.toString(), CryptoJS).toString(CryptoJS.enc.Hex);
    } else {
        const random = '5gkjB6SpmC9s';
        token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
        fingerprint = 9686767825751161;
        // $.fingerprint = 7811850938414161;
        const str = `${token}${fingerprint}${timestamp}${appId}${random}`;
        hash1 = CryptoJS.SHA512(str, token).toString(CryptoJS.enc.Hex);
    }
    let st: string = '';
    stk.split(',').map((item, index) => {
        st += `${item}:${getQueryString(url, item)}${index === stk.split(',').length - 1 ? '' : '&'}`;
    })
    const hash2 = CryptoJS.HmacSHA256(st, hash1.toString()).toString(CryptoJS.enc.Hex);
    return encodeURIComponent(["".concat(timestamp.toString()), "".concat(fingerprint.toString()), "".concat(appId.toString()), "".concat(token), "".concat(hash2)].join(";"))
}

function requireConfig() {
    return new Promise<void>(resolve => {
        console.log('开始获取配置文件\n')
        const jdCookieNode = require('./jdCookie.js');
        Object.keys(jdCookieNode).forEach((item) => {
            if (jdCookieNode[item]) {
                cookiesArr.push(jdCookieNode[item])
            }
        })
        console.log(`共${cookiesArr.length}个京东账号\n`)
        resolve()
    })
}

function generateFp() {
    let e = "0123456789";
    let a = 13;
    let i = '';
    for (; a--;)
        i += e[Math.random() * e.length | 0];
    return (i + Date.now()).slice(0, 16)
}

function getQueryString(url: string, name: string) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = url.split('?')[1].match(reg);
    if (r != null) return unescape(r[2]);
    return '';
}

function wait(t: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve()
        }, t)
    })
}
