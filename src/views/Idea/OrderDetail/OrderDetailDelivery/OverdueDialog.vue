<template>
    <customized-dialog
        class="customized-dialog"
        title="提示"
        :width="507"
        :visible="dialogVisible"
        @close="closeDialog"
        :showFooter="!!(userTypeRoute&OPERATE_INTERGRATED_MASK)"
        @submit="submit"
        @cancel="closeDialog"
    >
        <el-form class="form">
            <span class="dialog-blue-title inline-block">平台未过审原因：</span>
            <p class="content">{{ info.reject_reason }}</p>
            <span class="dialog-blue-title inline-block">运营修改意见：</span>
            <p v-if="!(userTypeRoute&OPERATE_INTERGRATED_MASK)">{{ info.modification_opinions }}</p>
            <el-input v-else type="textarea" show-word-limit :maxlength="500" v-model="modification_opinions" placehplder="选填，最多500个字符"></el-input>
        </el-form>
    </customized-dialog>
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";
import {mapState} from 'vuex';
import {OPERATE_INTERGRATED_MASK} from "@config/RouteAuth";

export default {
    name: "OverdueDialog",
    mixins: [DialogMixin],
    props:{
        info: {
            type: Object,
            default(){
                return {
                    reject_reason: '',
                    modification_opinions: '',
                    id: ''
                }
            }
        }
    },
    watch: {
        info(val) {
            this.modification_opinions = val.modification_opinions;
        }
    },
    data(){
        return {
            modification_opinions: '',
            OPERATE_INTERGRATED_MASK
        }
    },
    // 数据格式化
    computed: {
        ...mapState({
            userTypeRoute: state => state.global.userTypeRoute,
        })
    },
    methods: {
        submit(){
            this.$http.post("order/modification-opinions", {
                id: this.info.id,
                modification_opinions: this.modification_opinions,
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "提交成功",
                        type: 'success'
                    })
                    this.$emit('success', res.data.data.modification_opinions);
                    this.closeDialog();
                }
            })
        },
    }
}
</script>

<style scoped lang="scss">
    /deep/.form {
        .content {
            color: $font-color-secondary;
            margin: 8px 0 16px 0;
        }
        .el-textarea {
            margin-top: 8px;
            .el-textarea__inner {
                min-height: 130px !important;
            }
        }
        .dialog-blue-title {
            padding-left: 8px;
        }
    }
</style>