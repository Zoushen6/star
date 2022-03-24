<template>
    <el-row :gutter="3" class="h-100">
        <el-col :span="24/allStatus.length" v-for="(item,idx) in allStatus" :key="idx" class="order-item h-100">
            <svg-icon :icon-name="item.icon"></svg-icon>
            <div class="desc-container">
                <p class="desc">{{item.desc}}</p>
                <p class="num">{{item.num}}</p>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import {AllStatus} from "@views/Data/OrderStatus/OrderStatus.js";

    export default {
        name: "OrderStatus",
        props: {
            data: {
                type: Object,
                default: () => AllStatus.reduce((prev, next) => Object.assign(prev, {[next.key]: 0}), {})
            }
        },
        watch: {
            data: function (val) {
                this.getStatus(val);
            }
        },
        created() {
            this.allStatus = AllStatus;
        },
        data() {
            return {
                allStatus: null
            }
        },
        methods: {
            getStatus(val) {
                this.allStatus.forEach(item => {
                    item.num = val[item.key];
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "@views/Data/Data";

    .order-item {
        background-image: url("~@/assets/images/data/data-bg-order-state.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
    }

    .icon {
        width: 30px;
        height: 30px;
        margin: 30px;
    }

    .desc-container {
        margin-left: 23px;
        text-align: center;
    }

    .desc {
        margin-top: 16px;
        font-size: $font-size-addition;
        color: $text-color-secondary;
    }

    .num {
        font-size: 32px;
        font-family: $font-family-alternate;
        font-weight: bold;
        color: #FFDB3C;
        letter-spacing: 1px;
        text-shadow: 0px 2px 4px rgba(255, 224, 89, 0.28), 0px 1px 3px rgba(255, 255, 255, 0.53);
    }

</style>
