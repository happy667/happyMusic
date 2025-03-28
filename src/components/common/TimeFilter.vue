<template>
  <div class="time-filter">
    <!-- 主弹窗 -->
    <van-popup v-model="_showPopup"
               round
               position="bottom"
               class="main-popup">
      <div class="filter-content">
        <div class="header">
          <div class="title">收藏时间筛选</div>
          <van-icon name="cross"
                    class="close-icon"
                    @click="_showPopup = false" />
        </div>

        <div class="date-range">
          <div class="date-item start-date"
               @click="openPicker('start')">
            <div class="label">起始时间</div>
            <div class="value">{{ startTimeDisplay }}</div>
            <van-icon name="arrow-down"
                      class="arrow-icon" />
          </div>

          <div class="divider">至</div>

          <div class="date-item end-date"
               @click="openPicker('end')">
            <div class="label">结束时间</div>
            <div class="value">{{ endTimeDisplay }}</div>
            <van-icon name="arrow-down"
                      class="arrow-icon" />
          </div>
        </div>

        <div class="time-range-tips">
          可选范围：{{ filterStartTimeText }} - {{ filterEndTimeText }}
        </div>

        <div class="action-buttons">
          <van-button plain
                      block
                      color="#999"
                      @click="resetDates">重置</van-button>
          <van-button type="primary"
                      class="confirm-btn"
                      color="#fd4979"
                      @click="emitFilterChange">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model="showDatePicker"
               round
               position="bottom"
               class="picker-popup">
      <van-datetime-picker v-model="currentDate"
                           type="date"
                           :title="pickerTitle"
                           :min-date="minDate"
                           :max-date="maxDate"
                           @confirm="confirmDate"
                           @cancel="closeDatePicker" />
    </van-popup>
  </div>
</template>

<script>
import { convertDate } from '@/assets/common/js/convert.js'
import { mapMutations } from 'vuex'
export default {
  name: 'TimeFilter',
  props: {
    // 控制主弹窗显示/隐藏
    showTimeFilter: {
      type: Boolean,
      default: false
    },
    // 可选的最小日期
    minDate: {
      type: Date,
      default: () => new Date()
    },
    // 可选的最大日期
    maxDate: {
      type: Date,
      default: () => new Date()
    },
    //父组件传入的筛选条件
    filterCondition: {
      type: Object,
      default: () => ({
        startTime: null, // 起始时间
        endTime: null // 结束时间
      })
    }
  },
  data () {
    return {
      showDatePicker: false, // 日期选择器弹窗状态
      currentPickerType: null, // 当前操作类型：'start'或'end'
      startTime: this.minDate, // 最终起始时间（时间戳）
      endTime: new Date(), // 最终结束时间（时间戳）
      currentDate: null, //当前日期
    }
  },
  mounted () {
    //回填筛选数据
    this.loadFilterCondition()
  },
  computed: {
    // 主弹窗显示控制（双向绑定）
    _showPopup: {
      get () {
        return this.showTimeFilter
      },
      set (val) {
        this.$emit('update:showTimeFilter', val)
      }
    },
    // 格式化显示的起始时间
    startTimeDisplay () {
      return convertDate(this.startTime)
    },
    // 格式化显示的结束时间
    endTimeDisplay () {
      return convertDate(this.endTime)
    },
    // 动态日期选择器标题
    pickerTitle () {
      return this.currentPickerType === 'start' ? '选择起始时间' : '选择结束时间'
    },
    //起始筛选时间
    filterStartTimeText () {
      return convertDate(this.minDate)
    },
    //结束筛选时间
    filterEndTimeText () {
      return convertDate(new Date())
    }
  },
  watch: {
    showTimeFilter () {
      if (this.showTimeFilter) {
        this.setHideMiniPlayer(true)
      } else {
        this.setHideMiniPlayer(false)
      }
    }
  },
  methods: {
    ...mapMutations(['setHideMiniPlayer']),
    // 打开日期选择器
    openPicker (type) {
      this.currentPickerType = type // 设置当前操作类型
      if (this.currentPickerType === 'start') {
        this.currentDate = new Date(this.startTime)
      } else {
        this.currentDate = new Date(this.endTime)
      }
      this.showDatePicker = true // 显示日期选择器

    },
    // 关闭日期选择器
    closeDatePicker () {
      this.showDatePicker = false
    },
    // 确认选择的日期
    confirmDate (value) {
      // 根据当前操作类型存储时间戳
      if (this.currentPickerType === 'start') {
        this.startTime = value
      } else {
        this.endTime = value
      }
      this.closeDatePicker() // 关闭日期选择器
    },
    // 触发筛选事件
    emitFilterChange () {
      const startTime = this.startTime
      const endTime = this.endTime
      // 验证逻辑
      if (convertDate(startTime) > convertDate(endTime)) {
        this.$toast('起始时间不能大于结束时间')
        return
      }
      if (convertDate(startTime) === convertDate(this.minDate) && convertDate(endTime) === convertDate(new Date())) {
        this._showPopup = false
      } else {
        this.$emit('filterChange', { startTime, endTime })
      }
    },
    //重置筛选数据
    resetDates () {
      this.startTime = this.minDate.getTime()
      this.endTime = new Date().getTime()
      this.tempStart = null
      this.tempEnd = null
      this.$toast("已重置筛选条件")
    },
    //加载筛选数据
    loadFilterCondition () {
      const { startTime, endTime } = this.filterCondition
      if (startTime && endTime) {
        this.startTime = startTime
        this.endTime = endTime
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.time-filter {
  --primary-color: #fd4979;
  --text-primary: $color-common-x;
  --text-secondary: $color-common-b2;
  --background-light: #f9f9f9;

  .main-popup {
    overflow: visible;

    .filter-content {
      padding: 0.4rem;

      .header {
        margin-bottom: 0.5rem;
        position: relative;

        .title {
          font-size: 0.5rem;
          color: var(--text-primary);
          font-weight: 600;
          text-align: center;
        }

        .close-icon {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          font-size: $font-size-smaller;
          padding: 0.2rem;
        }
      }

      .date-range {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        margin-bottom: 0.4rem;

        .date-item {
          flex: 1;
          padding: 0.3rem;
          border-radius: 0.2rem;
          background: var(--background-light);
          position: relative;
          transition: all 0.2s;

          &:active {
            background: darken(#f9f9f9, 2%);
          }

          .label {
            font-size: $font-size-mini;
            margin-bottom: 0.2rem;
          }

          .value {
            font-size: $font-size-smaller;
            color: var(--text-primary);
            font-weight: 500;
          }

          .arrow-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            right: 0.3rem;
            font-size: $font-size-mini;
          }
        }

        .divider {
          color: var(--text-secondary);
          font-size: $font-size-smaller;
        }
      }

      .time-range-tips {
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: $font-size-mini;
        margin-bottom: 0.5rem;
        padding: 0.2rem;
        border-radius: 0.2rem;
        color: var(--text-secondary);
        text-align: center;
        background: var(--background-light);
      }

      .action-buttons {
        display: flex;
        gap: 0.3rem;

        .van-button {
          flex: 1;
          height: 1.1rem;
          border-radius: 0.2rem;
          font-size: $font-size-smaller;
        }
      }
    }
  }
}
</style>