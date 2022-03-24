<template>
    <el-row>
        <el-col :span="8" class="progress-item" v-for="item in allProgress" :key="item.key">
            <el-progress type="circle" :percentage="item.num" :color="item.color" :stroke-width="20"
                         :width="144">
            </el-progress>
            <div class="progress-desc">{{item.desc}}</div>
        </el-col>
    </el-row>
</template>

<script>
    import {AllProgress} from "@views/Data/ProjectProgress/ProjectProgress.js";

    export default {
        name: "ProjectProgress",
        props: {
            data: {
                type: Object,
                default: () => AllProgress.reduce((prev, next) => Object.assign(prev, {[next.key]: 0}), {})
            }
        },
        watch: {
            data: function (val) {
                this.handleData(val);
            }
        },
        data() {
            return {
                allProgress: null
            }
        },
        created() {
            this.allProgress = AllProgress;
        },
        methods: {
            handleData(val) {
                this.allProgress.forEach(item => {
                    item.num = val[item.key];
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "@views/Data/Data";

    /deep/ .el-progress__text {
        text-align: center;
        font-size: 32px !important;
        color: $font-color-white;
        line-height: 26px;
        letter-spacing: 1px;
        text-shadow: 0px 2px 4px rgba(255, 224, 89, 0.28), 0px 1px 3px rgba(255, 255, 255, 0.53);
        font-family: $font-family-alternate;
    }

    /deep/ .el-progress-circle > svg path:first-child {
        stroke: #15407A;
    }

    .progress-item {
        text-align: center;
    }

    .progress-desc {
        font-size: $font-size-base;
        font-family: PingFangSC-Regular, PingFang SC;
        color: $text-color;
        line-height: 50px;
    }
</style>
