<template>
    <div class="flex-vertical flex-1 m-l-r-16 container">
        <el-form class="customized-form padding-top background-white p-l-r-24" :model="formData"
                 ref="formData" :rules="formRules">
            <div class="title">分配规则</div>
            <div class="flex-1">
                <el-form-item label="每个账户下" label-width="100px" :required="true">
                    <el-button-group class="button-group-number">
                        <el-button>计划数</el-button>
                        <el-button style="font-size:12px">1</el-button>
<!--                        <el-input v-model="formData.planNumber"-->
<!--                                  disabled-->
<!--                                  oninput="if(value > 7 || value < 1 ){value = ''}"-->
<!--                                  onkeyup="value=value.replace(/[^\d]/g,'');"-->
<!--                                  @keyup.enter.native="$event => $event.target.blur()"-->
<!--                                  @blur="() => {if(!formData.planNumber){formData.planNumber=3}}"-->
<!--                        ></el-input>-->
                    </el-button-group>
                </el-form-item>
                <el-form-item label="用户定向" label-width="100px">
                    <customized-button-group :List="directList" :button-style="directButtonStyle" @handleButton="handleDirect"></customized-button-group>
                </el-form-item>
                <el-form-item label="广告策略" label-width="100px">
                    <customized-button-group :List="adStrategyList" :button-style="adStrategyButtonStyle" ></customized-button-group>
                </el-form-item>
                <el-form-item label="素材" label-width="100px">
                    <customized-button-group :List="materialList" :button-style="materialButtonStyle"></customized-button-group>
                </el-form-item>
                <el-form-item label="标题" label-width="100px">
                    <customized-button-group :List="titleList" :button-style="titleButtonStyle" ></customized-button-group>
                </el-form-item>
                <el-form-item label="下载详情页" label-width="100px">
                    <customized-button-group :List="downloadList" :button-style="downloadButtonStyle" ></customized-button-group>
                </el-form-item>
                <el-form-item label="转化跟踪" label-width="100px" class="transform">
                    <customized-button-group :List="transformList" :button-style="transformButtonStyle" ></customized-button-group>
                </el-form-item>
                <div class="dividing-line"></div>
                <el-form-item label="计划状态" label-width="100px" prop="status">
                    <el-switch
                        v-model="formData.status"
                        inactive-text=""
                        :active-value="0"
                        :inactive-value="1"
                    >
                    </el-switch>
                </el-form-item>
                <el-form-item label="计划名称" label-width="100px" prop="planName">
                    <el-input placeholder="请输入" show-word-limit maxlength="50" class="plan-name" v-model="formData.planName"> </el-input>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import CustomizedButtonGroup from "@views/Popular/components/CustomizedButtonGroup";
import {adStrategyList, directList, downloadList, materialList, titleList, transformList} from "./AllocationRules";
export default {
    name: "AllocationRules",
    components:{CustomizedButtonGroup},
    created() {},
    watch: {
        formData: {
            handler: function (val) {
                this.$emit('allocationListChange',val)
            },
            deep:true,
            immediate:true
        }
    },
    data() {
        return {
            formData: {
                planNumber:3,
                direct:2,
                strategy:2,
                material:3,
                title:2,
                download:1,
                transform:1,
                status: 1,
                planName:'',
            },
            formRules: {
                planName:{required: true, message: "请输入计划名称"},
            },
            directButtonStyle: 2,
            adStrategyButtonStyle: 2,
            materialButtonStyle: 3,
            titleButtonStyle: 2,
            downloadButtonStyle: 1,
            transformButtonStyle: 1,
            adStrategyList,
            directList,
            downloadList,
            materialList,
            titleList,
            transformList,
        }
    },
    methods: {

        handleDirect(val) {
            // this.reset();
            // this.directButtonStyle = val
        },

        handleValid() {
            if(this.$refs.formData) {
                return new Promise((resolve) => {
                    this.$refs.formData.validate((valid) => {
                        if(valid) {
                            resolve(valid)
                        }
                    })
                })
            }
        },

        reset() {
            this.formData.planNumber = 3
            if(this.$refs.formData) this.$refs.formData.resetFields();
        }
    }
}
</script>

<style scoped lang="scss">
.container {

    .customized-form {

        padding-bottom: 14px;

        /deep/ .el-form-item__label {
            line-height: 32px;
            color: $font-color-base;

        }

        .title {
            color: $font-color-base;
            font-size: $font-size-base;
            margin-bottom: 26px;
            font-weight: $font-weight-bold;
        }

        /deep/ .el-button-group {
            .el-button {
                height: 32px;
                min-width: 88px;
            }
        }

        /deep/.button-group-number {
            .el-input {
                width: 88px;
                display: inline-block;
                .el-input__inner {
                    vertical-align: bottom;
                    text-align: center;
                    border-top-left-radius: 0px;
                    border-bottom-left-radius: 0px;
                }
            }
            .el-button {
                font-weight: normal;
            }
        }

        .plan-name {
            width: 900px;
        }

        .transform {
            margin-bottom: 32px;
        }

        .dividing-line {
            //border-top: 2px dashed $bg-color-divider;
            width: 100%;
            height: 1px;
            background-image: linear-gradient(to right, $bg-color-divider 0%, $bg-color-divider 50%, transparent 50%);
            background-size: 8px 1px;
            background-repeat: repeat-x;
            margin-bottom: 25px;
        }
    }
}
</style>