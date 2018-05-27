import {commonParams ,options,domain} from './config.js'
import axios from 'axios'
import {jsonp} from 'common/js/jsonp'

export function getTopList() {
    // const url = '/api/topList'
    const url = domain + '/api/topList'
    const data = Object.assign({}, commonParams, {
        g_tk:5381,
        uin:0,
        format:'json',
        inCharset:'utf-8',
        outCharset:'utf-8',
        notice:0,
        platform:'h5',
        needNewCode:1,
        _:1513739202241
    })
return  axios.get(url,{
            params:data
        }).then(res=>{
            return Promise.resolve(res.data)
        })

}

export function getMusicList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    const data = Object.assign({}, {commonParams}, {
        g_tk:5381,
        uin:0,
        format:'json',
        inCharset:'utf-8',
        outCharset:'utf-8',
        notice:0,
        platform:'h5',
        needNewCode:1,
        tpl:3,
        page:'detail',
        type:'top',
        topid:topid,
        _:1513749776343
    })
    return jsonp(url,data,options)
}