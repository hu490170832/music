import {commonParams ,options,domain} from './config.js'
import axios from 'axios'
import {jsonp} from 'common/js/jsonp'

export function getRecommend () {
	// const url = '/api/comment'
	const url = domain + '/api/comment'
	const data = Object.assign({},commonParams)
	return axios.get(url,{
		params:data,
	}).then((res)=>{
		return Promise.resolve(res.data)
	})
}

export function getDiscList() {
	// let url = '/api/discList'
	let url = domain + '/api/discList'
	let data = {
		picmid:1,
		rnd:'0.9281824629693267',
		g_tk:5381,
		loginUin:0,
		hostUin:0,
		format:'jsonp',
		inCharset:'utf8',
		outCharset:'utf-8',
		notice:0,
		platform:'yqq',
		needNewCode:0,
		categoryId:'10000000',
		sortId:5,
		sin:0,
		ein:30,
	}
	return axios.get(url,{
		params: data
	}).then((res)=>{
		return Promise.resolve(res.data)
	})
}

export function getSongList(dissid) {
	// const url = '/api/discSongList'
	const url = domain + '/api/discSongList'
	const data = Object.assign({},commonParams,{
		type:1,
		json:1,
		utf8:1,
		onlysong:0,
		disstid:dissid,
		format:jsonp,
		g_tk:1606628967,
		jsonpCallback:'playlistinfoCallback',
		loginUin:0,
		hostUin:0,
		format:'jsonp',
		inCharset:'utf8',
		outCharset:'utf-8',
		notice:0,
		platform:'yqq',
		needNewCode:0,
	})
	return axios.get(url,{
		params: data
	}).then((res)=>{
		return Promise.resolve(res.data)
	})
}