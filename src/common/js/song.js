import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {getVkey} from 'api/song'
import {Base64} from 'js-base64'

export default class Song {
    constructor({id, mid, singer, name, album, duration, image, url}) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }
    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve,reject) => {
            getLyric(this.mid).then((res) => {
                if(res.retcode === 0) {
                    this.lyric = Base64.decode(res.lyric) 
                    resolve(this.lyric)    
                }else{reject("no lyric")}
            })
        })
        
    }
}

export function createSong(musicData,topList) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        // url: topList? `https://dl.stream.qqmusic.qq.com/C400${musicData.strMediaMid}.m4a?guid=9926679456&vkey=84DFE9867BD26DDE63194882077E66192AF0498CB30D060C264D221871FC3767A3C81C9AB82862353E3A6459D29E2C077D712D75F8DC28C2&uin=&fromtag=999` : `https://dl.stream.qqmusic.qq.com/C400${musicData.strMediaMid}.m4a?guid=9926679456&vkey=84DFE9867BD26DDE63194882077E66192AF0498CB30D060C264D221871FC3767A3C81C9AB82862353E3A6459D29E2C077D712D75F8DC28C2&uin=&fromtag=999`
        url: `http://isure.stream.qqmusic.qq.com/C100${musicData.strMediaMid}.m4a?fromtag=32` 
    })
}

function filterSinger(singer) {
    let ret = []
    if(!singer) {
        return ''
    }
    singer.forEach((item) => {
        ret.push(item.name)
    })
    return ret.join('/')
}