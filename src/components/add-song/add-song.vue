<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close iconfont">&#xe849;</i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="search" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <!-- <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches> -->
        <div class="list-wrapper">
          <div ref="songList" >
            <div class="list-inner">
              <!-- <song-list :songs="playHistory" @select="selectSong"> -->
              <!-- </song-list> -->
            </div>
          </div>
          <div>
            <div class="list-inner">
              <!-- <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list> -->
            </div>
          </div>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger"></suggest>
      </div>
      <!-- <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip> -->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  export default {
    data() {
      return {
        showFlag: false,
        query: '',
        showSinger: false
      }
    },
    methods:{
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      search(query) {
        this.query = query
      }
    },
    components: {
      SearchBox,
      Suggest
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: #fbfbfb
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: #000
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: #ccc

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>