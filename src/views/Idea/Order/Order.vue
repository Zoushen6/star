<template>
    <div class="h-100 overflow-auto-y flex-vertical">
        <div class="flex-space-between m-m-16">
            <div class="flex-all-center status-bar background-white border-radius-4" v-for="(item,idx) in statusPool" :key="idx" @click="changeStatus(item)" >
                <div class="status-light" :style="{'background': item.color }" v-if="routeName==='orderTable'&&item.mask&curStatus"></div>
                <svg-icon class="icon border-radius-50 inline-block" :icon-name="item.icon"></svg-icon>
                <div class="inline-block">
                    <div class="desc">{{item.desc+"（个）"}}</div>
                    <div class="count">{{item.count}}</div>
                </div>
            </div>
        </div>
        <div class="m-m-16 table-wrapper custom-block p-m-16 m-t-0 background-white border-radius-4 flex-1 flex-vertical">
            <div class="top-button customized-button">
                <el-button class="orderTable" type="primary" :plain="routeName!=='orderTable'" @click="routeTo('orderTable')">订单列表</el-button>
                <el-button class="videoTable" type="primary" :plain="routeName!=='videoTable'" @click="routeTo('videoTable')">视频数据表</el-button>
                <el-button type="primary" plain @click="routeTo('material')">素材库</el-button>
            </div>
            <keep-alive>
                <router-view :key="routeViewKey"></router-view>
            </keep-alive>
        </div>

        <!-- 首次登陆新人指引弹窗-->
        <customized-dialog
            title="新人指引"
            class="first-login"
            :visible="firstLoginDialogVisible"
            @close="resetDialog"
            :modal='false'
            :fullscreen = 'true'
            :clickModal="false"
        >
            <p>您好，这里有一份新人指引文件待查收哦～</p>
            <el-button type="primary" class="f-r customized-button m-t-20" @click="firstLogin">点击查看</el-button>
        </customized-dialog>
        <!-- /首次登陆新人指引弹窗-->
    </div>


</template>

<script>
    import {mapState} from 'vuex';
    import {TopStatus,STATUS_EMPTY} from "./StatusPool.js"
    import PaginationMixin from "@mixins/PaginationMixin";

    export default {
        name: "Order",
        mixins: [PaginationMixin],
        computed: {
            ...mapState({
                curStatus: state => state.order.curStatus,
            }),
            routeName(){
                return this.$route.name
            },
            routeViewKey() {
                // 开发环境中key热更新代码不会触发$route.path变化，所以加上时间当key
                return this.$route.path + process.env.NODE_ENV === 'production'? '' : new Date().getTime();
            }
        },

        mounted() {
            this.handleLoginTime();
        },

        data(){
            return{
                statusPool:null,
                OrderStatus:[],
                statusValue:'',
                //标志位 如果状态已被点亮 再次点击灭掉并且搜索所有订单
                statusFlag:true,
                firstLoginDialogVisible:false,
            }
        },

        created() {
            this.statusPool = TopStatus;
        },

        methods:{

            handleLoginTime(){
                if (this.$store.state.global.loginTime === 1){
                    this.firstLoginDialogVisible = true
                }
            },

            firstLogin(){
                this.firstLoginDialogVisible = false;
                this.routeTo("guide")
            },

            routeTo(name){
                this.$router.push({name});
            },

            changeStatus(item){
                if( this.statusValue === item.value && this.statusFlag === false)
                {
                    this.$store.commit('setOrderStatus', STATUS_EMPTY);
                    this.$store.commit('setOrderStatusValue','null');
                    this.statusFlag = !this.statusFlag
                }
                else if (this.routeName !== "orderTable"){
                    this.routeTo('orderTable');
                }else {
                    this.$store.commit('setOrderStatus', item.mask);
                    this.$store.commit('setOrderStatusValue',item.value);
                    this.statusValue = item.value;
                    this.statusFlag = !this.statusFlag
                }
            },
            resetDialog() {
                this.firstLoginDialogVisible = false
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "~@assets/sass/helpers/mixins.scss";

    .status-bar {
        font-weight: 500;
        font-family: $font-family-alternate;
        max-width: 325px;
        height: 80px;
        padding: 0 10px;
        position: relative;
        width: 15%;
        border-radius: 5.33px;


        .icon {
            width: 44px;
            height: 44px;
            margin: 0 1vw 0 0;
        }

        .desc{
            font-size: 12px;
            color: $font-color-auxiliary;
            line-height: 17px;
        }

        .count{
            color: $font-color-base;
            font-size: 30px;
            line-height: 36px;
        }

        .status-light{
            position: absolute;
            top: 0;
            width: 100%;
            height: 9px;
            border-radius: 5.33px 5.33px 0 0;
        }

        &:hover{
            box-shadow: 0px 0px 15px 0px rgba(213,213,213,0.6);
            cursor: pointer;
        }
    }

    .top-button .el-button--primary.is-plain {
        background: #FFFFFF;
        color: $theme-color;
        &:hover{
            background: #eaedff;
        }
    }

    /deep/ .first-login {

        position: absolute;
        top: 48px;
        right: 60px;
        left: initial;
        bottom: initial;
        width: 19vw;
        min-width: 340px;
        /*给左右的阴影留出空白*/
        padding: 0 3px;

        .el-dialog__header {
            padding: 10px 20px;
            color: $font-color-base;
            font-weight: $font-weight-bold;
            font-size: $font-size-base;
        }

        .el-dialog__headerbtn {
            top: 16px;
        }

        .el-dialog__body {
            color: $font-color-base;
            padding: 12px;
        }

        .el-dialog__body {
            @include clearFix;
        }

        .el-button {
            margin-top: 20px;
        }

        .el-dialog {
            margin-top: 10px!important;
            width: 100%!important;

            &:before {
                display: block;
                content: "";
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 8px solid #FFFFFF;
                position: relative;
                left: 90%;
                top: -6px;
                filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.1));
            }
        }
    }

</style>
