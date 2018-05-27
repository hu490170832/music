import { mapGetters, mapMutations, mapActions } from '../../../node_modules/_vuex@3.0.1@vuex';
import {playMove} from 'common/js/config'
import {shuffle} from 'common/js/util'


export {mapGetters} from 'vuex'

export const playListMinxin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {
        this.handlePlayList(this.playList)
    },
    activated() {
        this.handlePlayList(this.playList)
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(newVal)
        }
    },
    methods: {
        handlePlayList() {
            throw new Error('component must implement handlePlayList method')
        }
    }
}

export const playerMixin = {
    computed: {
        iconMode(){
            return this.mode === playMove.sequence? 'icon-shunxubofang': this.mode === playMove.loop ? 'icon-singlecycle' : 'icon-suijibofang'
        },
        ...mapGetters([
            'sequenceList',
            'currentSong',
            'playList',
            'mode'
        ])
    },methods :{
        changeMode() {
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if(mode === playMove.random) {
                list = shuffle(this.sequenceList)
            }else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        ...mapMutations({
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        })
    }
}

export const searchMixin = {
    data() {
      return {
        query: '',
        refreshDelay: 120
      }
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    methods: {
      onQueryChange(query) {
        this.query = query
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
      saveSearch() {
        this.saveSearchHistory(this.query)
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory'
      ])
    }
  }