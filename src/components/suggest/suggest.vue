<template>
  <scroll class="suggest" :data='result' :pullup='pullup' @scrollToEnd = 'searchMore' ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i class="iconfont" :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)" ></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations,mapActions} from 'vuex'
  import {playListMinxin} from 'common/js/mixin'
  import NoResult from 'base/no-result/no-result'
  const TYPE_SINGER = 'singer'
  const perpage = 20
  export default {
    mixins: [playListMinxin],
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        pulldown: true,
        hasMore: true,
        // refresh:false
      }
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh()
      },
      handlePlayList(playList) {
        const bottom = playList.length>0 ? '60px' : ''
        this.$refs.suggest.$el.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      _search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0,0)
        search(this.query, this.page, this.showSinger,perpage).then((res)=>{
          if(res.code===ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
            // this.refresh= false
          }
        }) 
      },
      // scrolldown(scrollY) {
      //   if(scrollY.y>60) {
      //     this.refresh= true
      //     this._search()
      //   }
      // },
      searchMore() {
        if(!this.hasMore) {
          return 
        }
        this.page++
        search(this.query, this.page, this.showSinger,perpage).then((res)=>{
          // console.log(res)
          if(res.code===ERR_OK) {
            // console.log(res)
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        }) 
      },
      getIconCls(item) {
          if(item.type === TYPE_SINGER) {
            return 'icon-wo'
          }else {
            return 'icon-music-note'
          }
      },
      getDisplayName(item) {
        if(item.type === TYPE_SINGER) {
          return item.singername
        }else {
          return `${item.name}-${item.singer}`
        }
      },
      selectItem(item) {
        console.log(item)
        if(item.type === TYPE_SINGER) {
          
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        }else {
          this.insertSong(item)
        }
      },
      _checkMore(data) {
        // console.log(data)
        const song = data.song
        // console.log(song.list)
        if(!song.list.length || (song.curnum + song.curpage * perpage)>song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult(data) {
        let ret = []
        if(data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida,...{type:TYPE_SINGER}})
        }
        if(data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(musicData => {
          if(musicData.songid &&　musicData.albummid) {
            ret.push(createSong(musicData))
          }
        });
        return ret 
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newQuery) {
        this._search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    position:fixed
    bottom: 0
    top: 164px
    overflow: hidden
    width :100%
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: rgba(0,0,0,.8);
      .name
        flex: 1
        font-size: $font-size-medium
        color: rgba(0,0,0,.8);
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>