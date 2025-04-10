<template>
  <div class="time-filter">
    <!-- 主弹窗 -->

    <van-popup v-model="_showPopup" round position="bottom" class="main-popup">
      <div class="filter-content">
        <div class="header">
          <div class="title">筛选歌曲</div>
          <van-icon name="cross" class="close-icon" @click="handleClose" />
        </div>

        <div class="time-filter-content">
          <div class="time-range">
            <div class="title">时间范围</div>
            <div class="time-picker">
              <div class="date-item start-date" @click="openPicker('start')">
                <div class="label">起始时间</div>
                <div class="value">{{ startTimeText }}</div>
                <van-icon name="arrow-down" class="arrow-icon" />
              </div>

              <div class="divider">至</div>

              <div class="date-item end-date" @click="openPicker('end')">
                <div class="label">结束时间</div>
                <div class="value">{{ endTimeText }}</div>
                <van-icon name="arrow-down" class="arrow-icon" />
              </div>
            </div>
          </div>

          <div class="play-count">
            <div class="title">播放次数</div>
            <div class="count-range">
              <van-field v-model="minPlayCount" type="number" placeholder="最小播放次数" :maxlength="10"
                @input="validateMinCount" />
              <div class="divider">至</div>
              <van-field v-model="maxPlayCount" type="number" placeholder="最大播放次数" :maxlength="10"
                @input="validateMaxCount" />
            </div>
          </div>
        </div>

        <div class="time-range-tips">
          <span class="tips-label">时间可选范围：</span>
          <span class="tips-value">{{ filterStartTimeText }} 至 {{ filterEndTimeText }}</span>
        </div>

        <div class="action-buttons">
          <van-button plain block color="#999" @click="handleReset">重置</van-button>
          <van-button type="primary" class="confirm-btn" color="#fd4979" @click="handleConfirm">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 日期选择器弹窗 -->
    <van-popup v-model="showDatePicker" round position="bottom" class="picker-popup">
      <van-datetime-picker v-model="currentDate" type="date" :title="pickerTitle" :min-date="minDate"
        :max-date="maxDate" @confirm="handleDateConfirm" @cancel="closeDatePicker" />
    </van-popup>
  </div>
</template>

<script>
import { convertDate } from '@/assets/common/js/convert.js'
import { mapMutations, mapState } from 'vuex'

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
        startTime: null,
        endTime: null,
        minPlayCount: null,
        maxPlayCount: null
      })
    }
  },
  data () {
    return {
      showDatePicker: false, // 日期选择器弹窗状态
      currentPickerType: null, // 当前操作类型：'start'或'end'
      startTime: this.minDate, // 默认开始时间为最小日期
      endTime: new Date(), // 默认结束时间为当前日期
      currentDate: null, //当前日期
      minPlayCount: '',
      maxPlayCount: '',
      startTimeText: '',
      endTimeText: ''
    }
  },
  mounted () {
    //回填筛选数据
    this.initFilterCondition()
  },
  computed: {
    ...mapState(['hideMiniPlayer']),
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
    showTimeFilter (val) {
      if (val) {
        this.initFilterCondition()
      }
    },
    _showPopup (val) {
      if (val) {
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
      this.currentDate = new Date(type === 'start' ? this.startTime : this.endTime)
      this.showDatePicker = true // 显示日期选择器
    },
    // 关闭日期选择器
    closeDatePicker () {
      this.showDatePicker = false
    },
    // 确认选择的日期
    handleDateConfirm (value) {
      // 根据当前操作类型存储时间戳
      if (this.currentPickerType === 'start') {
        this.startTime = value
        this.startTimeText = this.formatDate(value)
      } else {
        this.endTime = value
        this.endTimeText = this.formatDate(value)
      }
      this.closeDatePicker() // 关闭日期选择器
    },
    // 触发筛选事件
    handleConfirm () {
      if (!this.validateFilter()) return

      if (this.isDefaultValues()) {
        this._showPopup = false
        return
      }

      // 修改播放次数的处理逻辑
      const minCount = this.minPlayCount.trim() ? parseInt(this.minPlayCount) : null
      const maxCount = this.maxPlayCount.trim() ? parseInt(this.maxPlayCount) : null

      this.$emit('filterChange', {
        startTime: this.startTime,
        endTime: this.endTime,
        minPlayCount: minCount,
        maxPlayCount: maxCount
      })
      this.setHideMiniPlayer(false)
    },
    //重置筛选数据
    handleReset () {
      this.startTime = this.minDate
      this.endTime = new Date()
      this.minPlayCount = ''
      this.maxPlayCount = ''
      this.startTimeText = this.formatDate(this.startTime)
      this.endTimeText = this.formatDate(this.endTime)
      this.$toast("已重置筛选条件")
    },
    initFilterCondition () {
      const { startTime, endTime, minPlayCount, maxPlayCount } = this.filterCondition
      this.startTime = startTime || this.minDate
      this.endTime = endTime || new Date()
      this.startTimeText = this.formatDate(this.startTime)
      this.endTimeText = this.formatDate(this.endTime)
      console.log(minPlayCount, maxPlayCount)
      // 修复播放次数的回填
      this.minPlayCount = minPlayCount !== null ? minPlayCount : ''
      this.maxPlayCount = maxPlayCount !== null ? maxPlayCount : ''
    },
    onConfirmStartTime (date) {
      this.startTime = date
      this.startTimeText = this.formatDate(date)
      this.showStartPicker = false
    },
    onConfirmEndTime (date) {
      this.endTime = date
      this.endTimeText = this.formatDate(date)
      this.showEndPicker = false
    },
    onCancelStartTime () {
      this.showStartPicker = false
    },
    onCancelEndTime () {
      this.showEndPicker = false
    },
    formatDate (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    validateMinCount (value) {
      // 移除非数字字符
      this.minPlayCount = value.replace(/[^\d]/g, '')
    },
    validateMaxCount (value) {
      // 移除非数字字符
      this.maxPlayCount = value.replace(/[^\d]/g, '')
    },
    validateFilter () {
      const startTime = this.startTime
      const endTime = this.endTime
      const minCount = this.minPlayCount.trim() ? parseInt(this.minPlayCount) : null
      const maxCount = this.maxPlayCount.trim() ? parseInt(this.maxPlayCount) : null

      if (convertDate(startTime) > convertDate(endTime)) {
        this.$toast('起始时间不能大于结束时间')
        return false
      }

      // 只验证已输入的播放次数
      if (minCount !== null && minCount < 0) {
        this.$toast('最小播放次数不能小于0')
        return false
      }

      if (maxCount !== null && maxCount < 0) {
        this.$toast('最大播放次数不能小于0')
        return false
      }

      // 确保最小播放次数不能大于或等于最大播放次数
      if (minCount !== null && maxCount !== null && minCount > maxCount) {
        this.$toast('最小播放次数必须小于最大播放次数')
        return false
      }

      return true
    },
    isDefaultValues () {
      const isDefaultTime = convertDate(this.startTime) === convertDate(this.minDate) &&
        convertDate(this.endTime) === convertDate(new Date())
      const isDefaultPlayCount = !this.minPlayCount && !this.maxPlayCount
      return isDefaultTime && isDefaultPlayCount
    },
    handleClose () {
      this._showPopup = false
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.time-filter {
  --primary-color: #fd4979;
  --text-primary: $color-common-x;
  --text-secondary: $color-common-b2;
  --background-light: #f7f8fa;
  --border-color: #ebedf0;
  --divider-color: #f5f6fa;

  .main-popup {
    overflow: visible;
    border-radius: 0.3rem 0.3rem 0 0;

    .filter-content {
      padding: 0.4rem;

      .header {
        position: relative;
        margin-bottom: 0.4rem;
        padding-bottom: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid var(--divider-color);

        .title {
          height: 0.6rem;
          line-height: 0.6rem;
          font-size: $font-size-small-xx;
          color: var(--text-primary);
          font-weight: 500;
          text-align: center;
        }

        .close-icon {
          position: absolute;
          right: 0.3rem;
          color: var(--text-secondary);
          font-size: $font-size-smaller;
          padding: 0.2rem;
          transition: all 0.3s ease;
        }
      }

      .time-filter-content {
        .time-range{
          margin-bottom: 0.5rem;
        }
        .title {
            font-size: $font-size-smaller;
            color: var(--text-secondary);
            margin-bottom: 0.2rem;
            padding: 0 0.1rem;
          }
        .play-count {
          margin-bottom: 0.3rem;
          .count-range {
            display: flex;
            align-items: center;
            gap: 0.2rem;

            .van-field {
              flex: 1;
              padding: 0.15rem 0.3rem;
              background: #fff;
              border-radius: 0.2rem;
              border: 1px solid var(--border-color);
            }

            .divider {
              color: var(--text-secondary);
              font-size: $font-size-smaller;
              padding: 0 0.1rem;
              font-weight: 500;
            }
          }
        }

        .time-picker {
         
          display: flex;
          align-items: center;
          gap: 0.2rem;

          .date-item {
            flex: 1;
            padding: 0.3rem;
            border-radius: 0.2rem;
            background: var(--background-light);
            position: relative;
            border: none;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

            .label {
              font-size: $font-size-mini;
              color: var(--text-secondary);
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
            padding: 0 0.1rem;
            font-weight: 500;
          }
        }
      }

      .time-range-tips {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.2rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: $font-size-mini;
        padding: 0.2rem;
        border-radius: 0.1rem;
        background: var(--background-light);
        color: var(--text-secondary);
      }

      .action-buttons {
        display: flex;
        gap: 0.4rem;
        margin-top: 0.3rem;
        padding-top: 0.3rem;
        border-top: 1px solid var(--divider-color);

        .van-button {
          flex: 1;
          height: 0.9rem;
          border-radius: 0.1rem;
        }
      }
    }
  }
}
</style>