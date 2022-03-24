<template>
    <customized-table
        class="customized-table container overflow-hidden w-100 without-pagination has-border"
        ref="customizedTable"
        :table-height="null"
        :Selection="Selection"
        :loading="loading"
        :Data="fileList"
        :Header="header"
        :showPagination="false"
        @selectionChange="val => {$emit('selectionChange', val)}"
        @delete="row => {$emit('rowClick', row, 'delete')}"
        @showAccount="row => {$emit('rowClick', row, 'showAccount')}"
        @copyFile="row => {$emit('rowClick', row, 'copyFile')}"
        @downLoadFile="row => {$emit('rowClick', row, 'downLoadFile')}"
        @overdueReason="row => {$emit('rowClick', row, 'overdueReason')}"
    >
        <template v-slot:video="{row}">
            <el-popover
                popper-class="disable-padding"
                placement="right-end"
                width="200"
                trigger="hover">
                <div v-if="row.resource_type==='图片'">
                    <div class="img-url">
                        <el-image :src="row.resource_url"></el-image>
                    </div>
                </div>
                <div class="videoColumn" v-else-if="row.resource_type==='视频'">
                    <div class="left">
                        <video :src="row.resource_url" width="330" height="179" controls></video>
                    </div>
                </div>
                <span slot="reference">
                    <div v-if="row.resource_type==='图片'">
                        <div class="img-url">
                            <el-image :src="row.resource_url"></el-image>
                        </div>
                    </div>
                    <div class="inline-block" v-else-if="row.resource_type==='视频'">
                        <video :src="row.resource_url" width="126" height="72"></video>
                    </div>
                </span>
            </el-popover>
        </template>
    </customized-table>
</template>

<script>
import {newSubmitHeader} from "./UploadTable";

export default {
    name: "UploadTable",

    created() {
        this.header = newSubmitHeader;
    },

    data(){
        return {
            loading: false,
            header: []
        }
    },

    props:{
        fileList: {
            type:Array
        },
        Selection: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        doLayout(){
            this.$refs['customizedTable'].doLayout();
        }
    }
}
</script>

<style scoped lang="scss">
    @import "DeliveryTable.scss";
    .status {
        line-height: 18px;
        color: $theme-color;
        border-radius: 30px;
        border: 1px solid $theme-color;
        padding: 6px;
        font-size: $font-size-addition;
    }

    /deep/.el-table--striped .el-table__body tr.el-table__row td.el-table__cell {
        background: #FAFAFA;
    }

    /deep/.show-account, /deep/.show-reason, /deep/.show-orderStatus {
        &:hover {
            text-decoration: none !important;
        }
        span {
            border: 1px solid $theme-color;
            background-color: $color-light-blue;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: $font-size-addition;
        }
    }
    /deep/.show-reason {
        span {
            color: #FFA34B;
            border: 1px solid #FFA34B;
            background-color: #FFF1E4;
        }
    }
    /deep/ .show-orderStatus {
        span {
            color: $theme-color;
        }
    }
    /deep/ .img-url {
        img {
            height: 120px;
        }
    }
    /deep/.el-table .el-table__body .cell {
        line-height: 32px !important;
    }
</style>
