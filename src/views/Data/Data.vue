<template>
    <div class="h-100 data-base">
        <div :style="{transform:`scale(${scaleRate})`,marginBottom:`-${marginBottom}px`}"
             class="position-relative data-content"
        >
            <el-button icon="el-icon-switch-button" class="exit-button position-absolute" @click="exit">退出大屏</el-button>
            <div class="left-top position-absolute">
                <div class="bg-title">订单累计消耗（元）</div>
                <count-to class="count-to" :end-val="costSum" separator="" :duration="3000"
                          v-slot:default="{displayValue}">
                    <customized-count-to :value="displayValue"></customized-count-to>
                </count-to>
            </div>
            <div class="left-middle bg-common position-absolute">
                <div class="bg-title">昨日视频消耗排行榜</div>
                <cost-rank class="cost-rank" :inherit-loading="costLoading" :data="orderRank"></cost-rank>
            </div>
            <div class="left-bottom bg-common position-absolute">
                <div class="bg-title">团队消耗趋势图</div>
                <cost-trend  class="chart-wrapper"></cost-trend>
            </div>

            <time-clock class="time-clock position-absolute"></time-clock>
            <div class="top position-absolute">
                <order-status :data="orderSummary"></order-status>
            </div>

            <div class="middle-middle position-absolute">
                <div class="bg-title">项目消耗对比</div>
                <project-cost class="chart-wrapper"></project-cost>
            </div>
            <div class="middle-bottom position-absolute">
                <div class="bg-title">账户趋势/图表趋势</div>
                <account-trend  class="chart-wrapper"></account-trend>
            </div>

            <div class="right-middle bg-common position-absolute">
                <div class="bg-title">本周项目完成进度</div>
                <project-progress :data="orderSummary"></project-progress>
            </div>
            <div class="right-bottom bg-common position-absolute">
                <div class="bg-title">制作中的订单</div>
                <making-order class="making-order"></making-order>
            </div>
        </div>
    </div>
</template>

<script>
    const {body} = document;
    import screenfull from "screenfull";
    import CountTo from "@components/countTo/CountTo";
    import timeClock from "@views/Data/TimeClock/TimeClock.vue";
    import customizedCountTo from "@views/Data/CustomizedCountTo/CustomizedCountTo.vue";
    import projectProgress from "@views/Data/ProjectProgress/ProjectProgress.vue";
    import costRank from "@views/Data/CostRank/CostRank.vue";
    import makingOrder from "@views/Data/MakingOrder/MakingOrder.vue";
    import orderStatus from "@views/Data/OrderStatus/OrderStatus.vue";
    import costTrend from "@views/Data/CostTrend/CostTrend.vue";
    import projectCost from "@views/Data/ProjectCost/ProjectCost.vue";
    import accountTrend from "@views/Data/AccountTrend/AccountTrend.vue";
    import {animationDuration} from "@views/Data/ChartSetting";

    export default {
        name: "Data",
        components: {
            CountTo,
            timeClock,
            customizedCountTo,
            projectProgress,
            costRank,
            makingOrder,
            orderStatus,
            costTrend,
            accountTrend,
            projectCost
        },
        data() {
            return {
                costLoading: false,
                scaleRate: 1,
                marginBottom: 0,
                orderRank: null,
                costSum:0,
                orderSummary: null,
                isFullScreen: false,
                timerId: 0
            }
        },
        created(){
            this.fullScreen();
        },
        mounted() {
            this.resizeHandler();
            window.addEventListener('resize', this.resizeHandler);
            this.isFullScreen = screenfull.isFullScreen;
            this.getOrderSummary();
            this.timerId = setInterval(this.getOrderSummary, animationDuration);
            this.getCostSummary();
        },
        destroyed() {
            window.removeEventListener('resize', this.resizeHandler);
            clearInterval(this.timerId);
            screenfull.exit();
        },
        methods: {
            resizeHandler() {
                const rect = body.getBoundingClientRect();
                this.scaleRate = (rect.width / 1920).toFixed(6);
                /**
                 * 解决scale时height仍然是1080px,导致父元素scrollHeight依然是1080px
                 * Q：为什么scale时，父元素clientHeight是实际高度，scrollHeight是1080px？
                 * @type {number}
                 */
                this.marginBottom = 1080 * Math.max((1 - this.scaleRate), 0);
            },

            fullScreen(){
                if (!screenfull.isEnabled) {
                    this.$message({
                        message: "不支持全屏",
                        type: "warning"
                    });
                    return false;
                }
                screenfull.request().catch(err=>{
                    console.warn(err)});
            },

            exit() {
                this.$router.push("/");
            },
            getOrderSummary() {
                this.$http.get("/report/screen/number").then(res => {
                    if (res.data.code === 200) {
                        this.orderSummary = res.data.data;
                    }
                }).catch(err=>{
                    console.warn(err);
                    clearInterval(this.timerId);
                })
            },
            getCostSummary() {
                this.costLoading = true;
                this.$http.get("/report/screen").then(res => {
                    if (res.data.code === 200) {
                        this.costSum = Math.ceil(res.data.data.order_total_cost);
                        this.orderRank = res.data.data.creative_top;
                    }
                }).finally(()=>{
                    this.costLoading = false;
                })
            },
        }

    }
</script>

<style scoped lang="scss">
    @import "Data";
    @import "DarkTable";

    .data-base {
        background-color: #031C36;
        scrollbar-width: none;
        overflow-x: hidden;
        overflow-y: visible;
    }

    .data-base::-webkit-scrollbar {
        display: none;
    }

    .bg-title {
        background-image: url("~@/assets/images/data/data-bg-title.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        width: 188px;
        height: 28px;
        font-size: 16px;
        font-weight: $font-weight-bold;
        color: $block-title-color;
        line-height: 28px;
        padding-left: 8px;
        margin-left: 17px;
        margin-top: 21px;
    }

    .data-content {
        color: white;
        height: 1080px;
        width: 1920px;
        transform-origin: left top;
        background-image: url("~@/assets/images/data/data-bg-home.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    .exit-button {
        background-image: url("~@/assets/images/data/data-bg-button.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-color: transparent;
        border: initial;
        border-radius: initial;
        color: $font-color-blue;
        top: 72px;
        right: 50px;
        opacity: 0.8;
    }

    .time-clock {
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 14px;
        color: $font-color-blue;
    }

    .left-top {
        top: 80px;
        width: 546px;
        height: 172px;
        left: 27px;
        background-image: url("~@/assets/images/data/data-bg-left-top.png");
        background-size: 100%;
        background-position: center;

        .count-to {
            display: block;
            margin-left: 17px;
        }
    }

    .bg-common {
        background-image: url("~@/assets/images/data/data-bg-common.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
    }

    .left-middle {
        width: 546px;
        height: 386px;
        left: 27px;
        top: 260px;

        .cost-rank {
            margin: 10px 5px 0 5px;
        }
    }

    .left-bottom {
        left: 27px;
        top: 650px;
        width: 546px;
        height: 402px;
    }

    .top {
        width: 1312px;
        height: 90px;
        top: 143px;
        left: 580px;
    }

    .middle-middle {
        top: 240px;
        left: 580px;
        width: 760px;
        height: 393px;
        background-image: url("~@/assets/images/data/data-bg-middle-middle.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;

        .bg-title {
            margin-top: 27px;
        }
    }

    .chart-wrapper{
        margin: 0 10px;
    }

    .middle-bottom {
        top: 637px;
        left: 580px;
        width: 760px;
        height: 414px;
        background-image: url("~@/assets/images/data/data-bg-middle-bottom.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
    }

    .right-middle {
        width: 546px;
        height: 410px;
        left: 1348px;
        top: 240px;

        .bg-title {
            margin-top: 36px;
            margin-bottom: 70px;
        }
    }

    .right-bottom {
        width: 546px;
        height: 394px;
        left: 1348px;
        top: 657px;

        .making-order {
            margin: 10px 6px 0 6px;
        }
    }

    /deep/ .el-loading-mask {
        background-color: $data-bg-color-loading;
    }

    /deep/.customized-checkbox {
        .el-button {
            padding: 5px 10px;
            background: transparent;
            color: $text-color-third;
            border: 1px solid $text-color-third;
        }

        .button-active {
            color: $block-title-color;
            border: 1px solid $block-title-color;
            opacity: 1;
        }
    }
</style>
