<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
        
      </div>
    <div class="dots">
        <span v-for="(item,index) in dots" class="dot" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>
<script>
import { addClass } from "common/js/dom";
import BScroll from "better-scroll";
export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: String,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      if(this.autoplay) {
          this._play();
      }
    }, 20);
    window.addEventListener("resize",()=>{
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true);
        this.slider.refresh();
    })
  },
  activated() {
    if (this.autoplay) {
      this._play()
    }
  },
  deactivated() {
    clearTimeout(this.timer)
  },
  destroy() {
    clearTimeout(this.timer);
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;
      var sliderWidth = this.$refs.slider.clientWidth;
      var width = 0;
      for (var i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initDots() {
        this.dots = this.children.length;
        console.log(this.dots)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
      });
      this.slider.on('scrollEnd',()=>{
          let pageIndex = this.slider.getCurrentPage().pageX
          if(this.loop) {
              pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          if(this.autoplay) {
              clearTimeout(this.timer)
              this._play()
          }
      })

      this.slider.on('beforeScrollStart', () => { 
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _play(){
        let pageIndex = this.currentPageIndex + 1;
        if(this.loop) {
            pageIndex += 1;
        }
        this.timer = setTimeout(()=>{
            this.slider.goToPage(pageIndex, 0 , 400)
        },this.interval)
    }
  }

};
</script>

<style scoped>
.slider {
  overflow: hidden;
  position: relative;
}
.slider-item {
  float: left;
}
.slider-item a {
  display: block;
  width: 100%;
}
.slider-item a img {
  width: 100%;
}
.slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
}
     
.dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 4px;
    text-align: center;
    font-size: 0;
}
.dots .dot {
    display: inline-block;
    vertical-align: middle;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, .5)
}
.dots .dot.active {
    width: 20px;
    border-radius: 5px;
    background: rgba(255, 255, 255, .8)
}
</style>


