<!-- 顶通组件 -->
<template>
    <div class="top-bar" >
        <!-- logo -->
        <router-link class="logo f-l" to="/" alt="新数网络" title="新数网络"></router-link>
        <!-- /logo -->

        <span class="uniform-title f-l" title="新数网络·智能广告平台">北极星·智能广告平台</span>

        <div class="line f-l"></div>

        <div class="f-l">
            <!-- 菜单 -->
            <el-menu :default-active="activeIndex"
                     class="header-menu"
                     mode="horizontal"
                     @select="handleHeaderChange"
            >
                <template v-for="(item ,idx) in headerMenu">
                    <el-menu-item v-if="item.authority&userTypeRoute" :key="idx" :index="item.path" class="header-menu-item">{{item.title}}</el-menu-item>
                </template>
            </el-menu>
            <!-- 菜单 -->
        </div>

        <div class="f-r top-menu">

            <!-- 消息通知 -->
            <el-popover placement="top" width="300" trigger="hover"  popper-class="disable-popper-padding"
                        v-if="username" @show="getNotificationDetail" @after-leave="resetNotification">

                <div class="message-bar">
                    <span class="bell-title">提醒
                        <el-button type="text" class="f-r all-read iconfont" @click="axiosReadAll">一键已读</el-button>
                    </span>
                    <div class="message-list customized-scroll">
                        <el-link v-for="(item,idx) in messageList" :key="idx" type="info" :class="item.read_time===0?'link-not-read':''" :underline="false"
                                 class="link-base iconfont position-relative" @click="readNotification(item)">
                            <span :class="item.read_time === 0?'prefix-dot':''" class="iconfont icon-note">&#xe669;</span>
                            <span class="ell-2 message-detail" :title="item.message">{{ item.message+'>>' }}</span>
                        </el-link>
                    </div>
                    <!-- 分页 -->
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :hide-on-single-page="this.total <= 5"
                        :small="true"
                        :page-size="15"
                        :pager-count="5"
                        :current-page.sync="currentPage"
                        @current-change="currentChange"
                        :total="total" class="text-center">
                    </el-pagination>
                    <!-- /分页 -->
                </div>


                <span slot="reference" class="bell vertical-align-top">
                    <el-badge :value="notificationCnt" :max="99" class="item">
                        <span class="iconfont">&#xe66a;</span>
                    </el-badge>
                </span>

            </el-popover>
            <!-- /消息通知 -->

            <!-- 用户信息 -->
            <el-popover placement="top-end" width="96" trigger="hover" popper-class="disable-popper-padding" v-if="username">

                <el-button v-for="(item,idx) in authMenu" :key="idx" @click="chooseStrategy(item)">
                    <svg-icon :icon-name="item.iconfont" class="menu-icon"></svg-icon>{{item.title}}
                </el-button>

                <div slot="reference" class="username vertical-align-top" :title="name?name:username">
                    <span class="icon-user">
                        <img src="@assets/icon-user.png" alt="">{{name?name:username}}
                    </span>
                </div>

            </el-popover>
            <!-- 用户信息 -->

            <!-- 新手指引 -->
            <span class="guide iconfont vertical-align-top"  @click="newComerGuide" title="新手指引">&#xe629;</span>
            <!-- 新手指引 -->

        </div>

        <!-- 我的资料弹窗-->
        <customized-dialog
            class="customized-dialog"
            custom-class="profile"
            :title="dialogTitle"
            :visible="dialogVisible"
            :show-footer="true"
            :append-to-body="true"
            :width="600"
            @cancel="resetDialog('profileForm')"
            @submit="submitDialog('profileForm')"
            @close="resetDialog('profileForm')"
        >
            <el-form v-loading="profileDialogLoading" element-loading-background="transparent"  ref="profileForm" :model="profileForm" :rules="profileRules" label-width="80px" label-position="right"
                     class="dialog-form">
                <el-form-item label="账号名称" prop="username">
                    <el-input v-model="profileForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户姓名" prop="name">
                    <el-input v-model="profileForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="department_name" v-if="userTypeRoute^ADMIN_ROUTE_MASK">
                    <el-input v-model="profileForm.department_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="所属团队" prop="group_name" v-if="!(userTypeRoute&(MANAGERS_ROUTE_MASK | FINANCE_ROUTE_MASK))">
                    <el-input v-model="profileForm.group_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户角色" prop="role_name">
                    <el-input v-model="profileForm.role_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="tel">
                    <el-input v-model="profileForm.tel"></el-input>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /我的资料弹窗-->

        <!-- 修改密码弹窗-->
        <customized-dialog
            class="customized-dialog"
            :title="pwdDialogTitle"
            :visible="pwdDialogVisible"
            :show-footer="true"
            :append-to-body="true"
            :width="600"
            @cancel="resetDialog('pwdForm')"
            @submit="submitModify('pwdForm')"
            @close="resetDialog('pwdForm')"
        >
            <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-width="95px" label-position="right"
                     class="dialog-form">
                <el-form-item label="当前密码" prop="now_passwd">
                    <el-input v-model="pwdForm.now_passwd"  show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="passwd" >
                    <el-input v-model="pwdForm.passwd"  show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="passwd_repeat">
                    <el-input v-model="pwdForm.passwd_repeat"  show-password></el-input>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /修改密码弹窗-->


        <!-- 退出登陆弹窗-->
            <customized-dialog
            class="customized-dialog"
            title="退出登录"
            :visible="logoutDialogVisible"
            :show-footer="true"
            :append-to-body="true"
            :width="507"
            @cancel="resetDialog"
            @submit="subLogout"
            @close="resetDialog"
        >
            <p>确定退出登录？</p>
        </customized-dialog>
        <!-- /退出登陆弹窗-->
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {AUTH_MENU_LIST, HEADER_MENU_LIST} from "@config/AuthMenu";
    import DialogMixin from "@mixins/DialogMixin";
    import {RouteAuthMixin} from "@mixins/ConfigMixin";

    export default {
        //输出名称
        name: 'topBar',
        mixins: [DialogMixin, RouteAuthMixin],

        // 初始化数据
        data() {
            let checkTel = (rule, value, callback) => {
                const isPhone = /^1[34578]\d{9}$/;//手机号码
                if (isPhone.test(value)||value =="") {
                    callback()
                } else {
                    callback(new Error('请输入正确的手机号'))
                }
            };
            let checkNowPwd = (rule, value, callback) => {
                const nowPwd = /^\S{8,}$/;
                if (nowPwd.test(value)) {
                    callback()
                } else {
                    callback(new Error('密码不少于8位'))
                }
            };
            let checkNowPwdRepeated = (rule, value, callback) => {
                if(this.pwdForm.passwd == value){
                    callback()
                }else{
                    callback(new Error('两次输入密码不一致'))
                }
            };
            return {
                logoutDialogVisible:false,
                pwdDialogVisible: false,
                pwdDialogTitle: '',
                profileDialogLoading:false,
                //我的资料弹框form数据
                profileForm: {
                    username: '',
                    name:'',
                    // email: '',
                    tel:'',
                    role_id:'',
                    role_name:'',
                    department_id:'',
                    department_name:'',
                    group_id:'',
                    group_name:'',
                },
                //修改密码弹框form数据
                pwdForm:{
                    now_passwd:'',
                    passwd:'',
                    passwd_repeat:''
                },
                //弹框form条件规则
                profileRules: {
                    tel: [{required: false, validator: checkTel}]
                },
                pwdRules: {
                    now_passwd:[{required: true,message:"请输入当前密码"}],
                    passwd:[{required: true,validator:checkNowPwd}],
                    passwd_repeat:[{required: true,validator:checkNowPwdRepeated}]
                },
                authMenu: null,
                headerMenu: null,
                messageList: [],
                currentPage: 1,
                total: 0,
                strategy: {
                    'profile': this.routeToProfile,
                    'password': this.modifyPassword,
                    'exit': this.logout,
                    'download-center': this.routeToDownloadCenter,
                },
                notificationCnt: 0,
                notificationTimer: null,
            }
        },

        created() {
            this.authMenu = AUTH_MENU_LIST;
            this.headerMenu = HEADER_MENU_LIST;
        },

        // 数据格式化
        computed: {
            ...mapState({
                username: state => state.global.username,
                name: state => state.global.name,
                userTypeRoute: state => state.global.userTypeRoute,
                token: state => state.global.token,
                activeIndex: state => state.menu.activeHeaderIndex[1]
            })
        },

        mounted() {
            this.axiosNotifications();
            this.getNotificationsPolling();
            this.parent = this.$parent.$parent.$el;
            window.addEventListener('scroll', this.handleScroll, true);
        },

        beforeDestroy() {
            this.cancleNotificationsPolling();
            // 离开该页面需要移除这个监听的事件，不然会报错
            window.removeEventListener('scroll', this.handleScroll);
        },

        // 方法集合
        methods: {

            newComerGuide(){
                this.$router.push("/guide");
            },

            chooseStrategy(item) {
                this.strategy[item.iconfont](item);
            },

            //消息列表请求
            axiosNotificationDeatil() {
                return this.$http.get("/notification/list", {
                    params: {
                        page: this.currentPage,
                        page_size: 15
                    }
                });
            },

            //阅读消息请求
            axiosReadNotification(id) {
                return this.$http.post("notification/read", {
                    notification_id: JSON.stringify([id])
                });
            },

            //阅读消息请求
            axiosReadAll() {
                this.$http.post("notification/all-read").then(res=>{
                    if (res.data.code === 200){
                        this.getNotificationDetail();
                        this.axiosNotifications();
                    }
                });
            },

            //消息提醒数据请求
            axiosNotifications: async function () {
                const res = await this.$http.get("/notification/remind");
                if (res.data.code == 200) {
                    this.notificationCnt = Number(res.data.data.count);
                }
            },

            getNotificationsPolling() {
                this.notificationTimer = setInterval(this.axiosNotifications, 30000);
            },

            cancleNotificationsPolling() {
                clearInterval(this.notificationTimer);
            },

            //关闭弹框后，删除验证
            resetDialog(formName) {
                if (this.$refs[formName]) this.$refs[formName].resetFields();
                this.dialogVisible = false;
                this.pwdDialogVisible = false;
                this.logoutDialogVisible = false;
            },

            //我的资料
            routeToProfile(){
                this.dialogVisible = true;
                this.profileDialogLoading = true;
                this.dialogTitle = '我的资料';
                this.axiosUser().then((res) => {
                    if (res && res.data.code === 200){
                        this.profileForm = res.data.data;
                    }
                }).catch((error) => {
                    console.log(error)
                }).finally(()=>{
                    this.profileDialogLoading = false;
                })

            },

            //用户数据数据请求
            axiosUser() {
                return this.$http.get("user/profile", {});
            },

            //我的资料点击确定
            submitDialog(formName){
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogVisible = false
                let tel = this.profileForm.tel
                this.improveTel(tel).then((res) => {
                    if (res && res.data.code === 200){
                        this.$message({
                            message:"已更新联系方式",
                            type:"success"
                        })
                    }
                })
                } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //完善我的资料（联系方式）
            improveTel(tel){
                return this.$http.post("user/improve", {
                    tel: tel,
                });
            },

            //点击修改密码
            modifyPassword(){
                this.pwdDialogVisible = true;
                this.pwdDialogTitle = '修改密码';
            },

            //修改密码点击确定
            submitModify(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.pwdDialogVisible = false;
                        this.axiosModify().then((res) => {
                            if (res.data.code === 200) {
                                this.$message({
                                    message:"已成功修改密码",
                                    type:"success"
                                })
                            }
                            this.pwdDialogVisible = false;
                        }).catch(res => {
                            console.warn(res);
                        }).finally(() => {
                            //清空pwdForm
                            Object.keys(this.pwdForm).forEach(key=>{this.pwdForm[key]=''})
                        });
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            //修改密码
            axiosModify(){
                return this.$http.post("user/reset-passwd", {
                    now_passwd: this.pwdForm.now_passwd,
                    passwd: this.pwdForm.passwd,
                    passwd_repeat: this.pwdForm.passwd_repeat,
                });
            },

            //点击退出登录
            logout(){
                this.logoutDialogVisible = true;
                this.cancleNotificationsPolling();
            },

            //点击下载中心
            routeToDownloadCenter(){
                this.$router.push("/downloadCenter");
            },

            //退出登录弹窗点击确定
            subLogout() {
                localStorage.removeItem('smartAdPlatformId');//清除ls用户数据
                localStorage.removeItem('FinanceCenterHeader');//退出时清除财务中心表头
                this.$store.commit('removeUser');//清除vuex用户数据
                this.$store.commit('removeRoutes');//清除vuex中的路由数据
                this.$router.push("/login");
            },

            getNotificationDetail: async function () {
                const res = await this.axiosNotificationDeatil();
                if (res.data.code === 200) {
                    this.messageList = res.data.data.list;
                    this.total = res.data.data.pagination.total;
                }
            },

            resetNotification(){
                this.currentPage = 1;
            },

            currentChange() {
                this.getNotificationDetail();
            },

            readNotification: async function (item) {
                window.open("/#/idea"+item.url,"_blank");
                let res = await this.axiosReadNotification(item.notification_id);
                if (res.data.code === 200){
                    this.getNotificationDetail();
                }
            },

            handleHeaderChange(name){
                this.$router.push({name});
            }
        }
    }
</script>

<style lang="scss" scoped>

    .top-bar {
        height: 48px;
        background: #000729;
        color: #FFFFFF;
        position: fixed;
        z-index: 4;
        width: 100%;
        min-width: 900px;
        left: 0;
        top: 0;
    }

    .line {
        border-left: 1.5px solid white;
        opacity: 0.5;
        height: 20px;
        margin: 0 15px 0 38px;
        margin-top: 15px;
    }

    .logo {
        display: inline-block;
        background: url("~@/assets/logo-pure.png") no-repeat center;
        background-size: contain;
        height: 38px;
        width: 38px;
        vertical-align: middle;
        margin: 5px 10px 0px 20px;
    }

    /deep/.uniform-title{
        font-size: 15px;
        line-height: $line-height-large;
        color: #FFFFFF;
    }

    .username {
        height: 30px;
        margin: 0 10px 0 0;
        display: inline-block;
        cursor: pointer;
    }

    .bell{
        font-size: $font-size-headlines;
        margin: 0 40px;
        cursor: pointer;
        .iconfont{
            font-size: $font-size-headlines;
        }
    }

    .menu-icon{
        margin: 0 $font-size-addition 0 0;
    }

    .icon-user {
        img {
            width: 24px;
            margin-right: 8px;
            vertical-align: middle;
        }
    }

    .guide {
        cursor: pointer;
        .iconfont {
            display: inline-block;
        }
    }
    .el-badge__content {
        font-size: 10px;
    }
    .message-bar{
        width: 300px;
        height: 380px;
        .message-list{
            height: 290px;
            overflow: hidden auto;
        }

        .message-detail{
            margin-left: 10px;
            line-height: 18px;
        }

        .bell-title{
            width: 100%;
            height: 45px;
            display: inline-block;
            color: $font-color-base;
            font-size: $font-size-base;
            font-weight: bold;
            padding: 0 0 0 $font-size-headings;
            box-sizing: border-box;
            line-height: 45px;
            border-bottom: 1px solid rgba(213,213,213,0.6);
        }

        .all-read{
            margin: 4px 12px;
            font-size: $font-size-addition;
            transform : scale(0.83,0.83);
            &:before{
                content: '\e66c';
                display: inline-block;
                font-size: $font-size-addition;
                vertical-align: top;
            }
        }

        .icon-note{
            font-size: 10px;
            position: absolute;
            left: 16px;
            line-height: 20px;
            &:before{
                content: "";
                display: inline-block;
                margin: 0 4px 1px 0;
                width: 6px;
                height: 6px;
                border-radius: 50%;
            }
        }

        .prefix-dot{
            &:before{
                background: $color-danger;
            }
        }

        .link-base{
            height: 48px;
            padding: 0 20px 0 36px;
            text-align: left;
            justify-content: flex-start;
            &:hover{
                background: #F2F5FF;
            }
        }

        .el-link.el-link--info{
            color: $font-color-auxiliary;
            font-size: 12px;
            &:hover{
                color: $theme-color;
            }
        }

        .link-not-read.el-link--info{
            color: $font-color-base
        }

        .link-base.el-link--parimary{
            color: $color-link;
        }

        /deep/.el-pager .number{
            font-weight: $font-weight-base;
        }

        .message-list ,.el-pagination{
            padding-top: 5px;
        }
    }

    .f-r {
        margin-right: 30px;
    }
    .top-menu {
        height: 48px;
        line-height: 48px;
    }
    /deep/ .f-r .el-popover {
        cursor: pointer;
    }
    /deep/.el-badge__content.is-fixed {
        top: 16px;
        padding: 0 2px;
        font-size: $font-size-mini;
        height: $font-size-base;
        line-height: $font-size-base;
    }
    .item .icon {
        vertical-align: -0.35em;
    }

    /deep/.el-button--text{
        color:#999999;
        font-size: 12px;
    }

    .customized-scroll, .el-table__body-wrapper{
        &::-webkit-scrollbar {
            width: 6px;
        }
    }

    .profile {
            padding: 0!important;
    }

    .header-menu{

        display: inline-block;
        height: 100%;
        background-color: transparent;
        border: initial;

        .header-menu-item{
            color: #ffffff;
            height: 100%;
            opacity: 0.8;
            line-height: 48px;
            position: relative;
            border: initial;
        }

        .header-menu-item:hover, .el-menu-item.is-active{
            font-weight: $font-weight-bold;
            background-color: transparent;
            opacity: 1;
            color: #ffffff;
        }

        .header-menu-item.is-active:after, .header-menu-item:hover:after{
            display: inline-block;
            content: "";
            position: absolute;
            background: $bg-color-white;
            width: 61%;
            height: 2px;
            bottom: 7px;
            border-radius: 3px;
            left: 50%;
            transform: translateX(-50%) translateZ(0);
        }
    }

    .vertical-align-top .item{
        vertical-align: initial;
    }
</style>
