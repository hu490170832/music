<template>
  <div class="player" v-show="playList.length>0">
      <transition name="normal" 
                @enter='enter' 
                @after-enter='afterEnter'
                @leave='leave'
                @after-leave='afterLeave'
        >
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img width="100%" height="100%" :src="currentSong.image">
            </div>
            <div class="top">
                <div class="back" @click="back">
                    <i class="iconfont i-back">&#xe91b;</i>
                </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle"
                @touchstart.prevent='middleTouchStart'
                @touchmove.prevent='middleTouchMove'
                @touchend.prevent='middleTouchEnd'>
                <div class="middle-l" ref="middleL">
                    <div class="cd-wrapper" ref="cdWrapper">
                        <div class="cd" :class="cdCls">
                            <img :src="currentSong.image" width='100%' height="100%" class="image">
                        </div>
                    </div>
                    <div class="playing-lyric-wrapper">
                        <div class="playing-lyric">{{playingLyric}}</div>
                    </div>
                </div>
                <scroll class="middle-r" ref="lyricList" :data='currentLyric && currentLyric.lines'>
                    <div class="lyric-wrapper">
                        <div v-if="currentLyric">
                            <p ref="lyricLine" class="text" :class="{'current': currentLineNum===index}" v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                        </div>
                    </div>
                </scroll>
            </div>
            <div class="bottom">
                <div class="dot-wrapper">
                    <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                    <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                </div>
                <div class="progress-wrapper">
                    <span class="time time-l">{{format(currentTime)}}</span>
                    <div class="progress-bar-wrapper">
                        <progress-bar :percent='percent' @percentChange='onProgressBarChange'></progress-bar>
                    </div>
                    <span class="time time-r">{{format(currentSong.duration)}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left" @click="changeMode">
                        <i class="iconfont" :class="iconMode"></i>
                    </div>
                    <div @click="prev" class="icon prev i-left">
                        <i class="iconfont" :class='disableCls'>&#xe64c;</i>
                    </div>
                    <div class="icon i-center" @click="togglePlaying" :class='disableCls'>
                        <i :class="playIcon+' iconfont'"></i>
                    </div>
                    <div @click="next" class="icon i-right">
                        <i class="iconfont" :class='disableCls'>&#xe64c;</i>
                    </div>
                    <div class="icon i-right">
                        <i class="iconfont like">&#xe607;</i>
                    </div>
                </div>
            </div>
        </div> 
      </transition>
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon cd" :class="cdCls">
                <img width="40" height="40" :src="currentSong.image">
            </div>
            <div class="text">
                <h2 class="name" v-html="currentSong.name"></h2>
                <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div @click.stop="togglePlaying" class="control">
                <progress-circle :radius='radius' :percent='percent'>
                    <i :class=" miniPlayIcon + ' icon-play mini-play iconfont'"></i>
                </progress-circle>
            </div>
            <div class="control icon-play" @click.stop="showPlayList">
                <i class="icon-playlist iconfont">&#xe6e4;</i>
            </div>
        </div>
      </transition>
      <play-list ref="playList"></play-list>
      <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex'
import {prefixStyle} from 'common/js/dom'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar' 
import ProgressCircle from 'base/progress-circle/progress-circle'
// import {playMove} from 'common/js/config'
// import {shuffle} from 'common/js/util'
import Scroll from 'base/scroll/scroll'
import Lyric from 'lyric-parser'
import PlayList from 'components/playlist/playlist'
import {playerMixin} from 'common/js/mixin'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
    mixins:[playerMixin],
    data() {
        return {
            songReady: false,
            currentTime: 0,
            radius: 31,
            currentLyric:null,
            currentLineNum: 0,
            currentShow: 'cd',
            playingLyric: ''
        }
    },
  computed: {
      playIcon() {
          return this.playing ? 'icon-iconfont32' : 'icon-bofang1'
      },
      miniPlayIcon() {
          return this.playing ? 'icon-iconfont32' : 'icon-bofang1'
      },
    //   iconMode(){
    //       return this.mode === playMove.sequence? 'icon-shunxubofang': this.mode === playMove.loop ? 'icon-singlecycle' : 'icon-suijibofang'
    //   },
      cdCls() {
          return this.playing ? 'play' : 'play pause'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
          return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
          'fullScreen',
          'playing',
          'currentIndex'
      ])
  },
  created() {
      this.touch = {}
  },
  methods: {
      back() {
          this.setFullScreen(false)
      },
      open() {
          this.setFullScreen(true)
      },
      enter(el,done) {
            const {x,y,scale} = this._getPosAndScale()
            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
          animations.unregisterAnimation('move')
          this.$refs.cdWrapper.style.animation = ''
      },
      leave(el,done) {
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const {x, y, scale} = this._getPosAndScale()
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
      },
      end() {
          if(this.mode === playMove.loop) {
              this.loop()
          }else {
              this.next()
          }
      },
      loop() {
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
          if (this.currentLyric) {
              this.currentLyric.seek(0)
          }
      },
      next() {
          if(!this.songReady) {
              return
          }
          if (this.playList.length ===1) {
              this.loop()
          }else {
            let index = this.currentIndex + 1
            if(index === this.playList.length) {
                index = 0;
            }
            if (!this.playing) {
                this.togglePlaying()
            }
            this.setCurrentIndex(index)
          }
         
          this.songReady = false
      },
      prev() {
           if(!this.songReady) {
              return
          }
           if (this.playList.length ===1) {
              this.loop()
          }else {
            let index = this.currentIndex - 1
            if(index === -1) {
                index = this.playList.length - 1
            }
            this.setCurrentIndex(index)
            if (!this.playing) {
                this.togglePlaying()
            }
          }
          this.songReady = false
      },
      ready() {
            this.songReady = true
      },
      error() {
            this.songReady = true
      },
      updateTime(e) {
          this.currentTime = e.target.currentTime

      },
    //   changeMode() {
    //       const mode = (this.mode + 1) % 3
    //       this.setPlayMode(mode)
    //       let list = null
    //       if(mode === playMove.random) {
    //           list = shuffle(this.sequenceList)
    //       }else {
    //           list = this.sequenceList
    //       }
    //       this.resetCurrentIndex(list)
    //       this.setPlayList(list)
    //   },
      resetCurrentIndex(list) {
          let index = list.findIndex((item) => {
              return item.id === this.currentSong.id
          })
          this.setCurrentIndex(index)
      },
      getLyric() {
          this.currentSong.getLyric().then((lyric) => {
              this.currentLyric = new Lyric(lyric, this.handleLyric)
              if (this.playing) {
                //   console.log("play")
                  this.currentLyric.play()
              }
            //   console.log(this.currentLyric)
          }).catch(() => {
              this.currentLyric = null
              this.playingLyric = ''
              this.currentLineNum = 0
          })
      },
      handleLyric({lineNum, txt}) {
          this.currentLineNum = lineNum
          if (lineNum > 5) {
              let lineEl = this.$refs.lyricLine[lineNum - 5]
              this.$refs.lyricList.scrollToElement(lineEl, 1000)
          }else {
              this.$refs.lyricList.scrollTo(0,0,1000)
          }
          this.playingLyric = txt
      },
      showPlayList() {
          this.$refs.playList.show()
      },
      middleTouchStart(e) {
          this.touch.initiated = true
          const touches = e.touches[0]
          this.touch.startX = touches.pageX
          this.touch.startY = touches.pageY
      },
      middleTouchMove(e) {
          if(!this.touch.initiated) {
              return
          }
          const touch = e.touches[0]
          const deltaX = touch.pageX - this.touch.startX
          const deltaY = touch.pageY - this.touch.startY
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
              return
          }
          const left = this.currentShow === 'cd' ? 0: -window.innerWidth
          const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX)) 
          this.touch.percent = Math.abs(offsetWidth/window.innerWidth)
          console.log(this.touch.percent)
          this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
          this.$refs.lyricList.$el.style[transitionDuration] = 0
          this.$refs.middleL.style.opacity = 1 - this.touch.percent
          this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd() {
          let offsetWidth
          let opacity
          if (this.currentShow === 'cd') {
              if (this.touch.percent > 0.1) {
                  offsetWidth = -window.innerWidth
                  opacity = 0
                  this.currentShow = 'lyric'
              }else {
                  offsetWidth = 0
                  opacity = 1
              }
          }else {
              if(this.touch.percent < 0.9) {
                  offsetWidth = 0
                  opacity = 1
                  this.currentShow = 'cd'
              }else {
                  opacity = 0
                  offsetWidth = -window.innerWidth
              }
          }
            const time = 300
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$refs.middleL.style.opacity = opacity
            this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
            this.$refs.middleL.style[transitionDuration] = `${time}ms`
      },
      _pad(num, n=2) {
          let len = num.toString().length
          while(len<n) {
              num = "0" + num
              len++
          }
          return num

      },
      format(interval) {
          interval = interval | 0
          const minute = interval/60 | 0
          const second = this._pad(interval % 60,2) 
          return `${minute}:${second}`

      },
      onProgressBarChange(percent) {
          const currentTime = this.currentSong.duration * percent
          this.$refs.audio.currentTime = this.currentSong.duration * percent
          if(!this.playing) {
              this.togglePlaying()
          }
          if (this.currentLyric) {
              this.currentLyric.seek(currentTime * 1000)
          }
      },
      _getPosAndScale() {
            const targetWidth = 40
            const paddingLeft = 40
            const paddingBottom = 30
            const paddingTop = 80
            const width = window.innerWidth * 0.8
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {
                x,
                y,
                scale
            }
      },
      togglePlaying() {
        //   console.log(this.playing)
          this.setPlayingState(!this.playing)
          if (this.currentLyric) {
              this.currentLyric.togglePlay()
          }
      },
      ...mapMutations({
          setFullScreen: 'SET_FULL_SCREEN',
      })
  },
  watch: {
      currentSong(newSong, oldSong) {
          if(!newSong.id) {
              return
          }
          if(newSong.id === oldSong.id) {
              return
          }
          if (this.currentLyric) {
              this.currentLyric.stop()
          }
        //   console.log(newSong)
        clearTimeout(this.timer)
          this.timer=setTimeout(() => {
                this.$refs.audio.play()
                this.getLyric()
          }, 1000)
      },
      playing(newPlaying) {
            // console.log(newPlaying)
            const audio = this.$refs.audio
            this.$nextTick(()=>{
                newPlaying ? audio.play() : audio.pause()
            })
      }
  },
  components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList
  }
}
</script>
<style scoped>
    .normal-player {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: #222;
    }
    .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
    }
    .top {
        position: relative;
        margin-bottom: 25px;
    }
    .top .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        box-sizing: border-box;
        padding: 9px;
        height: 40px;
    }
    .top .i-back {
        font-size: 22px;
        color: #ffcd32;
    } 
    .top .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 18px;
        color: #fff;
    }
    .top .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #fff;
    }
    .player .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
    }
    .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
    }
    .progress-wrapper .time {
        color: #fff;
        font-size: 12px;
        line-height: 30px;
        width: 30px;
    }
    .progress-wrapper .time-left {
        text-align: left;
    }
    .progress-bar-wrapper {
        flex: 1;
    }
    .progress-wrapper .time-right {
        text-align: right;
    }
    .icon-singlecycle {
        position: relative;
        top: 3px;
    }
    .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
    }
    .middle-l .cd-wrapper {
        position: absolute;
        left: 10%;
        top: 0;
        width: 80%;
        height: 100%;
    }
    .middle-l .cd-wrapper .cd {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 10px solid rgba(255,255,255,0.1);
        border-radius: 50%;
        overflow: hidden;
    } 
    .middle-l .cd-wrapper .cd.play {
        animation: rotate 20s linear infinite;
    } 
    .middle-l .cd-wrapper .cd.pause {
        animation-play-state: paused;
    }     
    .playing-lyric-wrapper {
        width: 80%;
        margin: 30px auto 0 auto;
        overflow: hidden;
        text-align: center;
    }
    .playing-lyric {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #fff;
    }
           
    .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
          
    .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
    }
    .lyric-wrapper .text {
        line-height: 32px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
    }
    .lyric-wrapper .text.current {
        color: #fff;
    }
    .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: #fbfbfb;
        border-top: 1px solid #ccc;
    }
    .mini-play {
        position: absolute;
        left: 0;
        top: 0;
    }
    .player .mini-player .icon {
        width: 40px;
        padding: 0 10px 0 20px;
    }
    .player .mini-player .icon img {
        border-radius: 50%;
    }
    .player .mini-player .icon-play {
        font-size: 30px;
        color: #31c27c;
    }
    .player .mini-player .name {
        margin-bottom: 2px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        color: #000;
    }
    .player .mini-player .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
    }
    .player .mini-player .control {
        position: relative;
        width: 30px;
        padding: 0 10px;
        line-height: 1;
    }
    .icon-playlist {
        font-size: 28px;
        color: #31c27c;
    }
    .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
    }
    .dot-wrapper {
        text-align: center;
        font-size: 0;
    }
    .dot-wrapper .dot {
        display: inline-block;
        vertical-align: middle;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
    }
    .dot-wrapper .dot.active {
        width: 20px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.8);
    }        
              
    .operators {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .operators .icon {
        line-height: 1.2;
    }
    .operators .icon i {
        color: #39c782;
        font-size: 30px;
    }
    .operators .icon.disable i,.operators .icon i.disable {
        color: rgba(49, 194, 124, 0.5)
    }
    
    .i-center {
        top: 5px;
    }
    .i-center i {
        position: relative;
        top: 4px;
    }
    .i-center .icon-iconfont32 {
        position: relative;
        top: 2px;
    }
    /* .like {

    } */
    .operators .icon.prev {
        transform: rotate(180deg);
        line-height: 1;
    }
    .i-right {
        position: relative;
        top: 2px;
    }
    .normal-enter-active, .normal-leave-active {
        transition: all .4s;
    }
    .normal-enter-active .top, .normal-leave-active .top, .normal-enter-active .bottom, .normal-leave-active .bottom {
        transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
    .normal-enter, .normal-leave-to {
        opacity: 0;
    }
     .normal-enter .top, .normal-leave-to .top {
        transform: translate3d(0, -100px, 0);
     }
     
     .normal-enter .bottom, .normal-leave-to .bottom {
        transform: translate3d(0, 100px, 0)
    }

    .mini-enter-active, .mini-leave-active {
        transition: all 0.4s
    }
    .mini-enter, .mini-leave-to {
        opacity: 0
    }
    .icon-bofang1 {
        top: 3px;
    }
    .mini-player .cd.play {
        animation: rotate 20s linear infinite;
    }
    .mini-player .cd.pause {
        animation-play-state: paused;
    }

    @keyframes rotate {
        0% {transform: rotate(0)}
        100% {transform: rotate(360deg)}
    }
        

</style>

