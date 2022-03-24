<template>
    <!-- 上传成功弹窗  -->
    <customized-dialog
        title="提示"
        :width="507"
        :visible="dialogVisible"
        @close="closeDialog"
    >
        <div class="uploads">
            <p class="titles">
                <span class="iconfont">&#xe630;</span>
                <span class="content">恭喜您，上传成功！</span>
            </p>
            <p class="upload-btn" v-if="upload">
                <el-button type="primary" @click="continueUpload">继续上传</el-button>
            </p>
        </div>
    </customized-dialog>
    <!-- 上传成功弹窗  -->
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";
export default {
    name: "CustomizedUploadFileSuccess",

    mixins: [DialogMixin],

    props:{
        upload:{
            type:Boolean,
            default:false
        }
    },

    methods: {
        continueUpload(){
            this.closeDialog();
        },
    }
}
</script>

<style scoped lang="scss">

    .uploads {
        .titles {
            .content {
                font-size: $font-size-headings;
                color: $font-color-base;
                margin-left: 3px;
            }
            .iconfont {
                color: $color-success !important ;
            }
        }
        .upload-btn {
            text-align: right;
            margin-bottom: -10px;
            /deep/ .el-button {
                width: 88px;
                height: 32px;
                padding-top: 8px;
            }
        }
    }

</style>