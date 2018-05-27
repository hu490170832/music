import {commonParams, domain} from './config.js'
import axios from 'axios'

export function getLyric(mid) {
    // const url = '/api/lyric'
    const url = domain + '/api/lyric'

    const data = Object.assign({}, commonParams, {
        songmid: mid,
        pcachetime: +new Date(),
        platform: 'yqq',
        hostUid: 0,
        needNewCode: 0,
        g_tk: 1231716946,
        format: 'json'
    })
    return axios.get(url,{
        params: data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}

export function getVkey() {
    const url = domain + '/api/getVkey'
    return axios.get(url,{
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}