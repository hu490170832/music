'use strict'
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// nodejs代理接口

var axios = require('axios')
var apiRoutes = express.Router()
app.use('/api', apiRoutes)
app.get('/api/comment', (req, res) => {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

app.get('/api/discList', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://y.qq.com/portal/playlist.html',
    },
    params: req.query
  }).then((response)=>{
    let ret = response.data
   if(typeof response.data === "string"){
    let reg = /^\w+\((.+)\)$/
    let matches = ret.match(reg);
    if(matches) {
      ret = JSON.parse(matches[1]);
    }
   }
    res.json(ret)
  }).catch((err) => {
    console.log(err)
  })
})

app.get('/api/lyric', (req, res) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://y.qq.com/portal/player.html',
    },
    params: req.query
  }).then((response)=>{
    let ret = response.data
    if(typeof response.data === "string"){
     let reg = /^\w+\(({[^()]+})\)$/
     let matches = ret.match(reg);
     if(matches) {
       ret = JSON.parse(matches[1]);
     }
    }
     // console.log(response.data)
     res.json(ret)
  }).catch((err) => {
    console.log(err)
  })
})


app.get('/api/discSongList', (req, res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://y.qq.com/n/yqq/playlist/2989777756.html',
    },
    params: req.query
  }).then((response)=>{
    let ret = response.data
    if(typeof response.data === "string"){
      let reg = /^\w+\((.*)\)$/
     let matches = ret.match(reg);
     if(matches) {
       ret = JSON.parse(matches[1]);
     }
    }
     res.json(ret)
  }).catch((err) => {
    console.log(err)
  })
})

app.get('/api/topList', (req, res) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://m.y.qq.com/',
    },
    params: req.query
  }).then((response)=>{
    // let ret = response.data
    // if(typeof response.data === "string"){
    //   let reg = /^\w+\((.*)\)$/
    //  let matches = ret.match(reg);
    //  if(matches) {
    //    ret = JSON.parse(matches[1]);
    //  }
    // }
    //  res.json(ret)
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

app.get('/api/search', (req, res) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url,{
    headers: {
      referer: 'https://m.y.qq.com/',
    },
    params: req.query
  }).then((response)=>{
    // let ret = response.data
    // if(typeof response.data === "string"){
    //   let reg = /^\w+\((.*)\)$/
    //  let matches = ret.match(reg);
    //  if(matches) {
    //    ret = JSON.parse(matches[1]);
    //  }
    // }
    //  res.json(ret)
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})




// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}