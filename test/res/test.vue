<template>
  <div>
    <div>选中：{{ now.value.value }}</div>
    <div class="seamless-scroll-detail-big-box">
      <!--
        循环的时候，把所有主控全部循环到
        但只展示 [first, first + 3) 之间的内容
      -->
      <div class="seamless-scroll-detail-btn-box">
        <div :class="'btn-box ' + (leftDisabled ? 'disaebld-btn-box' : 'active-btn-box')" @click="onPrev">《&nbsp;&nbsp;</div>
      </div>
      <div class="seamless-scroll-detail-data-box" v-loading="loading">
        <div v-if="items.length > 0">
          <div v-for="(item, index) in items" :key="index"  v-if="index >= first && index < first + 3">
            <div :class="now.index === (index) ? 'is-active' : 'not-active'" @click="onChangeShow(index)">
              {{ item.value }}
            </div>
          </div>
        </div>
        <div v-else>
          <div class="empty-data-box">
            <el-empty description="暂无数据" />
          </div>
        </div>
      </div>
      <div class="seamless-scroll-detail-btn-box">
        <div :class="'btn-box ' + (rightDisabled ? 'disaebld-btn-box' : 'active-btn-box')" @click="onNext">&nbsp;&nbsp;》</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      leftDisabled: true,
      rightDisabled: false,
      items: [ { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 } ],
      first: 0,
      position: 0,
      now: { // 当前活跃对象
        index: 0,
        value: {}
      },
    }
  },
  created () {
    this.now.value = this.items[0];
  },
  methods: {
    /*
      按下一步的时候，向右前进一格，[ ○ □ □ ] □ □ □ => [ □ ○ □ ] □ □ □
      如果已经到最右，则把看不见的向左推一格 [ □ □ ○ ] □ □ □  => □ [ □ □ ○ ] □ □
      如果已经到最后，则什么都不做 □ □ □ [ □ □ ○ ]

      按上一步的时候，向左前进一格，  □ □ □ [ □ ○ □ ] <= □ □ □ [ □ □ ○ ]
      如果已经到最左，则把看不见的向右推一格 □ □ [ ○ □ □ ] □ <= □ □ □ [ ○ □ □ ] 
      如果已经到最前，则什么都不做 [ ○ □ □ ] □ □ □

      初始值（first）= 0
      显示范围：[first, first + 3)
      现在位置（ position ） = 0
      */
      onChangeIndex () {
      // this.nowIndex = index;
      this.selectedSingleVal = "voltage";
      this.now.value = this.items[this.now.index];
    },
    onChangeShow (index) {
      this.now.index = index;
      this.position = index - this.first;
      if (this.first >= 0) {
        this.leftDisabled = false;
      } else {
        this.leftDisabled = true;
      }
      if (this.first < this.items.length - 1) {
        this.rightDisabled = false;
      } else {
        this.rightDisabled = true;
      }
      this.onChangeIndex();
    },
    onNext () {

      if (this.rightDisabled) return;

      /*
        点击下一步：
        now.index++
        position++
        如果 position > 2 （超出显示）
        first ++
        position = 2
        否则 first = 0
        */
      this.leftDisabled = false;
      if (this.items.length === 0)  return;
      this.now.index++;
      if (this.now.index === this.items.length - 1) {
          this.rightDisabled = true;
      }
      if (this.now.index === this.items.length) {
        this.now.index =  this.items.length - 1;
        this.rightDisabled = true;
        alert('后面没有了');
        return;
      }
      this.position++;
      if (this.position > 2) {
        this.position = 2;
        this.first++;
        if (this.first > this.items.length - 3) {
          this.first = this.items.length - 3;
          this.rightDisabled = true;
          alert('后面没有了');
        }
      }

      this.onChangeIndex();
    },
    onPrev () {

      if (this.leftDisabled) return;

      /*
        点击上一步
        now.index--
        poition--
        如果 position < 0 （超出显示）
        position = 0
        first --
        如果 fisrt < 0 => first - 0
        否则
        first = 0
        */
      this.rightDisabled = false;
      if (this.items.length === 0)  return;
      this.now.index--;
      if (this.now.index === 0) {
          this.leftDisabled = true;
      }
      if (this.now.index < 0) {
        this.now.index = 0;
        this.leftDisabled = true;
        alert('前面没有了');
        return;
      }
      this.position--;
      if (this.position < 0) {
         // □ □ □ [ ○ □ □ ]
        this.position = 0;

        // 向左移动的时候，一般情况下只要 first-- 即可，直到 first 为 0
        this.first--;
        if (this.first < 0) {
          this.first = 0;
          this.leftDisabled = true;
          alert('前面没有了');
        }
      }

      this.onChangeIndex();
    },
  }
}
</script>
<style lang="scss" scoped>
.seamless-scroll-detail-big-box {
  >div {
    display: inline-block;
    vertical-align: middle;
    height: 450px;
  }

  .seamless-scroll-detail-btn-box {
    width: 40px;
    text-align: center;

    .btn-box {
      margin-top: calc((78vh - 170px) / 2);
      display: block;
      height: 40px;
      line-height: 40px;

      background: rgba($color: #CCCCCC, $alpha: 0.5);
      border-radius: 50%;
    }

    .active-btn-box {
      cursor: pointer;
    }
    .active-btn-box:hover {
      background: rgba($color: #CCCCCC, $alpha: 0.3);
    }
    .active-btn-box:active {
      background: rgba($color: #fdff98, $alpha: 0.5);
    }
    .disaebld-btn-box {
      cursor: not-allowed;
    }
  }

  .seamless-scroll-detail-data-box {
    width: calc(100% - 80px);
    >div {
      height: 100%;
      >div {
        width: 33.33%;
        height: 100%;
        display: inline-block;
        margin-top: 40px;
        vertical-align: top;
        >div {
          margin: 0px 10px;
          height: calc(100% - 50px);
          cursor: pointer;
          >div {
            height: 100%;
          }
        }
      }

      .empty-data-box {
        >div {
          cursor: default !important;
        }
        width: 100% !important;
      }
    }
  }

  .is-active {
    background: rgba($color: #17579e, $alpha: 0.4);
  }

  .hidden-master-box {
    display: none;
  }
}
</style>