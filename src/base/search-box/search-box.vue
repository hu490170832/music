<template>
  <div class="search-box">
    <i class="iconfont icon-fangdajing"></i>
    <input class="box" v-model="query" :placeholder='placeholder'/>
    <i @click="clear" v-show="query" class="icon-dismiss iconfont"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import {debounce} from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      setQuery(query) {
        this.query = query
      }
    },
    created() {
      this.$watch('query',debounce( (newQuery) => {
        this.$emit('query', newQuery)
      },200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: #f3f3f3
    border-radius: 6px
    .icon-fangdajing
      font-size: 24px
      color: #ccc
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: #f3f3f3
      color: rgba(0,0,0,0.6)
      font-size: $font-size-medium
      &::placeholder
        color: rgba(0,0,0,0.2)
    .icon-dismiss
      font-size: 16px
      color: #ccc
</style>