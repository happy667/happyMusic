<template>
  <div class="edit-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <!-- loading -->
    <loading :loading="loading" />
    <template v-if="userDetail">
      <section class="cell-container">
        <!-- 通知栏 -->
        <div class="noticeBar">
          <van-notice-bar left-icon="bullhorn-o"
                          background="#fff"
                          color='#FD4979'
                          mode="closeable"
                          :text="noticeBarText" />
        </div>

        <van-cell-group :border="false">
          <!-- 昵称 -->
          <div class="nikename">
            <van-cell title="昵称"
                      is-link
                      :to="{name:'editNickname',params:{nickname:userDetail.nickname}}"
                      :value="userDetail.nickname" />

          </div>

          <!-- 性别 -->
          <div class="gender">
            <van-cell title="性别"
                      clickable
                      @click="toggleOption('gender')"
                      :value="genderValue" />
          </div>

          <!-- 出生日期 -->
          <div class="birthday">
            <van-cell title="出生日期"
                      clickable
                      @click="toggleOption('birthday')"
                      :value="birthday" />
          </div>

          <!-- 地区 -->
          <div class="address">
            <van-cell title="地区"
                      clickable
                      @click="toggleOption('address')"
                      :value="address" />
          </div>

        </van-cell-group>

      </section>
      <footer v-if="user">
        <div class="options">
          <!-- 修改密码 -->
          <div class="options-item updatePwd van-hairline--right"
               @click="$router.push('/user/edit/editPassword')">
            <div class="icon">
              <i class="iconfont icon-xiugaimima"></i>
            </div>
            <div class="text">
              修改密码
            </div>
          </div>
          <!-- 退出登录 -->
          <div class="options-item logout"
               @click="logout">
            <div class="icon">
              <i class="iconfont icon-tuichu"></i>
            </div>
            <div class="text">
              退出登录
            </div>
          </div>
        </div>

      </footer>
      <van-popup v-model="showPopup"
                 round
                 get-container="edit-container">
        <!-- 修改性别 -->
        <div class="updateGender"
             v-if="option==='gender'">
          <van-radio-group v-model="currentGender"
                           checked-color="#FD4979"
                           @change="handleGenderChange">
            <van-cell-group>
              <van-cell title="保密"
                        :border="false"
                        clickable
                        @click="currentGender = '0'">
                <template #right-icon>
                  <van-radio name="0" />
                </template>
</van-cell>
<van-cell title="男" :border="false" clickable @click="currentGender = '1'">
    <template #right-icon>
                  <van-radio name="1" />
                </template>
</van-cell>
<van-cell title="女" :border="false" clickable @click="currentGender = '2'">
    <template #right-icon>
                  <van-radio name="2" />
                </template>
</van-cell>
</van-cell-group>
</van-radio-group>
</div>
<!-- 出生日期 -->
<div class="updateBirthday" v-if="option==='birthday'">
    <van-datetime-picker type="date" @cancel="showPopup=false" @confirm="handleSaveBirthday" :value="currentDate" :max-date="maxDate" :min-date="minDate" :formatter="formatter" />
</div>
<!-- 地区 -->
<div class="updateAddress" v-if="option==='address'">
    <van-area :area-list="areaList" @cancel="showPopup=false" @confirm="handleSaveAddress" :columns-num="2" :value="selectAreaValue" title="请选择省市" />
</div>
</van-popup>
</template>
</div>
</template>
<script>
    import loginApi from '@/api/login.js'
    import userApi from '@/api/user.js'
    import areaList from 'common/js/area.js'
    import User from '@/assets/common/js/user.js'
    import {
        convertDate
    } from 'common/js/convert.js'
    import {
        USER_TOKEN
    } from 'common/js/config.js'
    import {
        clearItem
    } from 'common/js/localStorage.js'
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import {
        ERR_OK
    } from '@/api/config.js'
    export default {
        name: 'userEdit',
        data() {
            return {
                userDetail: null, // 用户详情
                loading: false,
                areaList,
                maxDate: new Date(), // 当前日期
                minDate: new Date('1920/1/1'), // 最小日期
                formatter(type, value) { // 日期控件格式化
                    if (type === 'year') {
                        return `${value}年`
                    } else if (type === 'month') {
                        return `${value}月`
                    } else if (type === 'day') {
                        return `${value}日`
                    }
                    return value
                },
                showPopup: false, // 弹出层
                option: '', // 当前操作的功能
                currentGender: null // 用户选择的性别

            }
        },
        mounted() {
            if (this.user) {
                this.getUserDetail(this.user.userId)
            }
        },

        computed: {
            ...mapState(['user', 'currentPlayIndex']),
            // 性别处理
            genderValue() {
                let gender = ''
                switch (this.userDetail.gender) {
                    case 0:
                        gender = '保密'
                        break
                    case 1:
                        gender = '男'
                        break
                    case 2:
                        gender = '女'
                        break
                }
                return gender
            },
            // 生日
            birthday() {
                return this.userDetail.birthday < 0 ? '未设置' : convertDate(this.userDetail.birthday)
            },
            // 当前日期
            currentDate() {
                return this.userDetail.birthday < 0 ? new Date() : new Date(this.userDetail.birthday)
            },
            // 地址
            address() {
                // 省份代码
                let provinceCode = this.userDetail.province
                let province = this.areaList.province_list[provinceCode]
                    // 城市代码
                let cityCode = this.userDetail.city
                let city = this.areaList.city_list[cityCode]
                return province + ' ' + city
            },
            // 公告文字
            noticeBarText() {
                let day = this.userDetail.createDays
                let createTime = convertDate(this.userDetail.createTime)
                return `您来到这里已经有${day}天啦,创建于${createTime}`
            },
            // 选择的地址
            selectAreaValue() {
                return this.userDetail.city.toString() || this.userDetail.province.toString()
            }
        },
        watch: {
            user() {
                if (this.user) {
                    this.getUserDetail(this.user.userId)
                }
            }
        },
        methods: {
            ...mapMutations(['setLoginUser', 'setUserLikeList', 'setToken', 'setHideMiniPlayer']),
            // 返回上一个路由
            routerBack() {
                this.$utils.routerBack()
            },
            // 获取用户详情
            async getUserDetail(id) {
                this.loading = true
                const {
                    data: res
                } = await userApi.getUserDetail(id)
                if (res.code === ERR_OK) {
                    let user = new User({
                        userId: res.profile.userId,
                        nickname: res.profile.nickname,
                        avatarUrl: res.profile.avatarUrl,
                        gender: res.profile.gender,
                        province: res.profile.province,
                        birthday: res.profile.birthday,
                        city: res.profile.city,
                        createDays: res.createDays,
                        createTime: res.createTime
                    })
                    this.userDetail = user
                    this.currentGender = user.gender.toString()
                }
                this.loading = false
            },
            toggleOption(type) {
                this.showPopup = true
                this.option = type
            },
            // 退出登录
            logout() {
                this.$utils.alertConfirm({
                    message: '确定要退出登录吗',
                    confirmButtonText: '退出'
                }).then(() => {
                    loginApi.logout().then(res => {
                        if (res.data.code === ERR_OK) {
                            // 清空用户所有信息
                            clearItem(USER_TOKEN)
                            this.setLoginUser(null)
                            this.setUserLikeList(null)
                            this.setToken(null)
                                // 添加不缓存路由
                            this.$store.commit('setAddNoCacheComponents', 'user')
                            this.$router.replace('/user') // 跳转到个人首页
                        }
                    })
                }).catch(() => {})
            },
            // 处理修改性别
            async handleGenderChange() {
                try {
                    let gender = parseInt(this.currentGender)
                        // 执行处理修改性别
                    const {
                        data: res
                    } = await userApi.updateUserInfo({
                        gender
                    })
                    if (res.code === 200) {
                        // 修改成功
                        this.$toast('修改成功')
                        this.userDetail.gender = gender
                        this.showPopup = false
                    } else {
                        this.$toast(res.data.message)
                    }
                } catch (error) {
                    this.nicknameErr = error.data.message
                    this.$toast(error.data.message)
                }
            },
            // 保存出生日期
            async handleSaveBirthday(time) {
                try {
                    let birthday = new Date(time).getTime()
                        // 执行保存出生日期
                    const {
                        data: res
                    } = await userApi.updateUserInfo({
                        birthday
                    })
                    if (res.code === 200) {
                        // 修改成功
                        this.$toast('修改成功')
                        this.userDetail.birthday = birthday
                        this.showPopup = false
                    } else {
                        this.$toast(res.data.message)
                    }
                } catch (error) {
                    this.nicknameErr = error.data.message
                    this.$toast(error.data.message)
                }
            },
            // 保存修改地区
            async handleSaveAddress(address) {
                try {
                    // 获取省份id
                    let province = address[0].code
                        // 获取城市id
                    let city = address[1].code
                        // 执行保存出生日期
                    const {
                        data: res
                    } = await userApi.updateUserInfo({
                        province,
                        city
                    })
                    if (res.code === 200) {
                        // 修改成功
                        this.$toast('修改成功')
                        this.userDetail.province = province
                        this.userDetail.city = city
                        this.showPopup = false
                    } else {
                        this.$toast(res.data.message)
                    }
                } catch (error) {
                    this.nicknameErr = error.data.message
                    this.$toast(error.data.message)
                }
            }
        }

    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .edit-container>>>.van-picker__cancel,
    .edit-container>>>.van-picker__confirm {
        color: $color-common;
    }
    
    .edit-container>>>.van-popup {
        width: 90%;
    }
    
    .edit-container {
        width: 100%;
        min-height: 100vh;
        background-color: $color-common-background;
        footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            box-shadow: 0 0rem 0.3rem rgba(0 0 0, 12%);
            .options {
                display: flex;
                .options-item {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    height: 1.5rem;
                    line-height: 1.5rem;
                    color: $color-common;
                    text-align: center;
                    font-size: $font-size-smaller;
                    .icon {
                        margin-right: 0.2rem;
                    }
                }
                .updatePwd {}
            }
        }
        .address>>>.van-cell .van-cell__title {
            flex: 0.5;
        }
    }
</style>