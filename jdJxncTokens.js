/*
京喜农场 Tokens
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
// 每个账号 token 是一个 json，示例如下
// {"farm_jstoken":"749a90f871adsfads8ffda7bf3b1576760","timestamp":"1610165423873","phoneid":"42c7e3dadfadsfdsaac-18f0e4f4a0cf"}
let JxncTokens = [
    '{"farm_jstoken":"03374f3219b3eaa3e3279d11c89f95c6","phoneid":"500b699699e1b87548f74bb99426fff3c568bedc","timestamp":"1615094636906","pin":"30335729-763446"}',//账号一的京喜农场token
    '{"farm_jstoken":"afb9d1b169d5a6af09e37306efc8d31b","phoneid":"c6db16b185bd38eb742cb755ff6afab49d3f4324","timestamp":"1621733060849","pin":"jd_4020c6ffa8304"}'//账号二的京喜农场token
]
// 判断github action里面是否有京喜农场 token
if (process.env.JXNCTOKENS) {
    if (process.env.JXNCTOKENS.indexOf('&') > -1) {
        console.log(`您的京喜农场 token 选择的是用&隔开\n`)
        JxncTokens = process.env.JXNCTOKENS.split('&');
    } else if (process.env.JXNCTOKENS.indexOf('\n') > -1) {
        console.log(`您的京喜农场 token 选择的是用换行隔开\n`)
        JxncTokens = process.env.JXNCTOKENS.split('\n');
    } else {
        JxncTokens = process.env.JXNCTOKENS.split();
    }
} else if (process.env.JD_COOKIE) {
    console.log(`由于您环境变量里面未提供 tokens，当种植 APP 种子时，将不能正常进行任务，请提供 token 或 种植非 APP 种子！`)
}
JxncTokens = [...new Set(JxncTokens.filter(item => !!item))]
for (let i = 0; i < JxncTokens.length; i++) {
    const index = (i + 1 === 1) ? '' : (i + 1);
    exports['JXNCTOKEN' + index] = JxncTokens[i];
}

var _0xodF='jsjiami.com.v6',_0x5b0b=[_0xodF,'cyNU','XcOkE8O8wqc=','bsOsw4LCsRUKacOqw6xywrnCpcOBwqzDrMK4w78Hc0RtARs1LMK7UsORw5DDtTvDlMOhTWdJ','w7PDhsK5LTw=','VA0TwroQwpk=','w6xQw4hObsKK','wqrDmcK/KmQ=','wqduwp7DhcOT','KCpb','5q2F6Laf5Y+2w69KNcKRQ8Ki5aGE5Ye45Lug6KS56Iy4dOS9lueZvcKJHWtDelV+S8KQwqHlkZDpnpnmsrHli4jljpnDpQAMw7A=','qzJQKjsjhUKiamhDLiI.Jrcom.v6=='];(function(_0x575984,_0x111392,_0x45a010){var _0x199276=function(_0x3fe5bc,_0x4fea58,_0x564d83,_0x7e4c96,_0x31f329){_0x4fea58=_0x4fea58>>0x8,_0x31f329='po';var _0x1b3d5d='shift',_0x48218b='push';if(_0x4fea58<_0x3fe5bc){while(--_0x3fe5bc){_0x7e4c96=_0x575984[_0x1b3d5d]();if(_0x4fea58===_0x3fe5bc){_0x4fea58=_0x7e4c96;_0x564d83=_0x575984[_0x31f329+'p']();}else if(_0x4fea58&&_0x564d83['replace'](/[qzJQKhUKhDLIJr=]/g,'')===_0x4fea58){_0x575984[_0x48218b](_0x7e4c96);}}_0x575984[_0x48218b](_0x575984[_0x1b3d5d]());}return 0x8dbb1;};return _0x199276(++_0x111392,_0x45a010)>>_0x111392^_0x45a010;}(_0x5b0b,0x138,0x13800));var _0xa80f=function(_0x573aaa,_0x1954c9){_0x573aaa=~~'0x'['concat'](_0x573aaa);var _0x28dbcb=_0x5b0b[_0x573aaa];if(_0xa80f['fYTBaI']===undefined){(function(){var _0x34fb78=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x4c41c3='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x34fb78['atob']||(_0x34fb78['atob']=function(_0x108344){var _0x1c9d23=String(_0x108344)['replace'](/=+$/,'');for(var _0x231b41=0x0,_0x409c1c,_0x79d606,_0x4d4dd3=0x0,_0x539f42='';_0x79d606=_0x1c9d23['charAt'](_0x4d4dd3++);~_0x79d606&&(_0x409c1c=_0x231b41%0x4?_0x409c1c*0x40+_0x79d606:_0x79d606,_0x231b41++%0x4)?_0x539f42+=String['fromCharCode'](0xff&_0x409c1c>>(-0x2*_0x231b41&0x6)):0x0){_0x79d606=_0x4c41c3['indexOf'](_0x79d606);}return _0x539f42;});}());var _0x11caff=function(_0x4969ce,_0x1954c9){var _0x1deab0=[],_0x54f040=0x0,_0x11157a,_0x28c8dd='',_0x2e4762='';_0x4969ce=atob(_0x4969ce);for(var _0x4c665e=0x0,_0x81f3b1=_0x4969ce['length'];_0x4c665e<_0x81f3b1;_0x4c665e++){_0x2e4762+='%'+('00'+_0x4969ce['charCodeAt'](_0x4c665e)['toString'](0x10))['slice'](-0x2);}_0x4969ce=decodeURIComponent(_0x2e4762);for(var _0x4c705a=0x0;_0x4c705a<0x100;_0x4c705a++){_0x1deab0[_0x4c705a]=_0x4c705a;}for(_0x4c705a=0x0;_0x4c705a<0x100;_0x4c705a++){_0x54f040=(_0x54f040+_0x1deab0[_0x4c705a]+_0x1954c9['charCodeAt'](_0x4c705a%_0x1954c9['length']))%0x100;_0x11157a=_0x1deab0[_0x4c705a];_0x1deab0[_0x4c705a]=_0x1deab0[_0x54f040];_0x1deab0[_0x54f040]=_0x11157a;}_0x4c705a=0x0;_0x54f040=0x0;for(var _0x4f3ecc=0x0;_0x4f3ecc<_0x4969ce['length'];_0x4f3ecc++){_0x4c705a=(_0x4c705a+0x1)%0x100;_0x54f040=(_0x54f040+_0x1deab0[_0x4c705a])%0x100;_0x11157a=_0x1deab0[_0x4c705a];_0x1deab0[_0x4c705a]=_0x1deab0[_0x54f040];_0x1deab0[_0x54f040]=_0x11157a;_0x28c8dd+=String['fromCharCode'](_0x4969ce['charCodeAt'](_0x4f3ecc)^_0x1deab0[(_0x1deab0[_0x4c705a]+_0x1deab0[_0x54f040])%0x100]);}return _0x28c8dd;};_0xa80f['LuAVWF']=_0x11caff;_0xa80f['mCXDyr']={};_0xa80f['fYTBaI']=!![];}var _0x390a3d=_0xa80f['mCXDyr'][_0x573aaa];if(_0x390a3d===undefined){if(_0xa80f['dUKlOc']===undefined){_0xa80f['dUKlOc']=!![];}_0x28dbcb=_0xa80f['LuAVWF'](_0x28dbcb,_0x1954c9);_0xa80f['mCXDyr'][_0x573aaa]=_0x28dbcb;}else{_0x28dbcb=_0x390a3d;}return _0x28dbcb;};function getJxToken(){var _0xa422={'lGSBc':_0xa80f('0','9qEv'),'zYXMd':function(_0x3fddf8,_0x2e8c46){return _0x3fddf8(_0x2e8c46);},'EtUUR':function(_0xc1dc78,_0x2dd44b){return _0xc1dc78(_0x2dd44b);},'fhrXi':function(_0x4b8614){return _0x4b8614();}};function _0x2cfb27(_0x3d541e){let _0x19600a=_0xa422[_0xa80f('1','Ye&F')];let _0x1a62e9='';for(let _0x44ee85=0x0;_0x44ee85<_0x3d541e;_0x44ee85++){_0x1a62e9+=_0x19600a[parseInt(Math[_0xa80f('2',']aCG')]()*_0x19600a[_0xa80f('3','J@ZI')])];}return _0x1a62e9;}return new Promise(_0x3d4dca=>{let _0x1934d2=_0xa422[_0xa80f('4','&w[x')](_0x2cfb27,0x28);let _0x140a50=(+new Date())['toString']();if(!currentCookie[_0xa80f('5','YcXf')](/pt_pin=([^; ]+)(?=;?)/)){console[_0xa80f('6','WGWr')](_0xa80f('7','4!)U'));_0x3d4dca(null);}let _0x1ab949=currentCookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1];let _0xa37fe3=$[_0xa80f('8','MVeX')](''+_0xa422['EtUUR'](decodeURIComponent,_0x1ab949)+_0x140a50+_0x1934d2+'tPOamqCuk9NLgVPAljUyIHcPRmKlVxDy')['toString']();currentToken={'timestamp':_0x140a50,'phoneid':_0x1934d2,'farm_jstoken':_0xa37fe3};_0xa422[_0xa80f('9','ZsI%')](_0x3d4dca);});};_0xodF='jsjiami.com.v6';
