<template>
    <div class="flex-vertical setting-box flex-1 overflow-hidden">
        <router-link class="uniform-link iconfont" :to="fromPath">返回到素材库</router-link>
        <el-form :model="uploadRuleForm" :rules="uploadRules" class="upload-file p-l-r-32 background-white" ref="uploadRuleForm" label-width="80px" :inline="true">
            <el-form-item label="产品名称" prop="productName">
                <el-select v-model="uploadRuleForm.productName" placeholder="请选择" prop="productName">
                    <el-option v-for="item in productNameType" :key="item.id" :label="item.item"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="行业名称" prop="industryName">
                <el-select v-model="uploadRuleForm.industryName" placeholder="请选择" prop="industryName">
                    <el-option v-for="item in productIndustry" :key="item.id" :label="item.item"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <div class="material">上传素材</div>
            <el-upload
                class="flex-1"
                :drag="true"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :accept="this.fromPath==='/idea/material/videoLibrary'?fileType.video:fileType.image"
                :on-change="uploadSuccess"
                :before-upload="beforeUpload"
                @drop.native="beforeUpload"
                :auto-upload="false"
                :show-file-list="false"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-form>

        <div class="table-content flex-1 flex-vertical p-l-r-32 background-white" v-if="tableData.length!==0">
            <customized-table
                class="flex-1 overflow-hidden w-100 customized-table without-pagination"
                ref="customizedTable"
                :loading="loading"
                :Data="tableData"
                :Header="header"
                :showPagination="false"
                table-height="100%"
                @deleteFile="handleDelete"
            >
                <template v-slot:video="{row}">
                    <el-popover
                        popper-class="disable-padding"
                        placement="right-end"
                        width="200"
                        trigger="hover">
                        <div v-if="row.type=='image'">
                            <div class="img-url">
                                <el-image :src="row.fileUrl"></el-image>
                            </div>
                        </div>
                        <div class="videoColumn" v-else-if="row.type=='video'">
                            <div class="left">
                                <video :src="row.fileUrl" width="330" height="179" controls></video>
                            </div>
                        </div>
                        <span slot="reference">
                                    <div v-if="row.type=='image'">
                                        <div class="img-url">
                                            <el-image :src="row.fileUrl"></el-image>
                                        </div>
                                    </div>
                                    <div class="inline-block" v-else-if="row.type=='video'">
                                        <video :src="row.fileUrl" width="126" height="72"></video>
                                    </div>
                                </span>
                    </el-popover>
                </template>
            </customized-table>
            <el-button class="finish customized-button m-t-10 m-b-10" type="primary" @click="handleSuccess('uploadRuleForm')">完成</el-button>
        </div>
        <el-collapse v-else class="flex-1 overflow-auto el-collapse-arrow-text p-l-r-32 background-white" v-model="activeNames">
            <el-collapse-item title="素材格式说明：" name="1">
                <div class="descriptions">
                    <p>头条素材规格说明：横版视频： 封面图宽高比1.78（下限：1280 * 720，上限：2560 *
                        1440）,视频资源支持mp4、mpeg、3gp、avi文件格式，宽高比16:9，大小不超过500M。</p>
                    <p> 竖版视频： 封面图宽高比0.56（9:16），下限：720 * 1280，上限：1440 *
                        2560，视频资源支持mp4、mpeg、3gp、avi文件格式，大小不超过500M。</p>
                    <p> 横版大图： 宽高比1.78，大小1.5M以下，下限：1280 * 720，上限：2560 * 1440。</p>
                    <p>竖版大图：宽高比0.56（9:16），大小1.5M以下，下限：720 * 1280，上限：1440 * 2560。</p>
                    <p>小图： 宽高比1.52，大小1.5M以下，下限：456 * 300，上限：1368 * 900。</p>
                    <p>快手素材规格说明：竖版视频：
                        分辨率≥720p，码率≥1000kbps，帧率≥20fps，音频码率≥64kbps，时长5s-10mins，格式MP4，小于100M。</p>
                    <p>横版视频： 分辨率≥720p，码率≥1000kbps，帧率≥20fps，音频码率≥64kbps，时长5s-10mins，格式MP4，小于100M。</p>
                    <p>竖版图片： 宽高尺寸大于等于720*1280，小于等于1440*2560，宽高比9:16，支持格式jpg/jpeg/png，大小≤2M。</p>
                </div>
            </el-collapse-item>
        </el-collapse>

        <customized-upload-file-loading ref="uploadLoading"></customized-upload-file-loading>

        <customized-upload-file-success ref="uploadSuccess" :upload="true" @dialogClose="resetTableData"></customized-upload-file-success>

    </div>
</template>

<script>
import axios from 'axios';
import {header} from "./UploadMaterial";
import {mapState} from "vuex";
import CustomizedDialog from "@components/CustomizedDialog";
import InfoFormMixin from "@mixins/InfoFormMixin";
import TableHeightHandleMixin from "@mixins/TableHeightHandleMixin";
import {fileType} from "@tools/FileType";
import CustomizedUploadFileLoading from "@views/upload/CustomizedUploadFileLoading";
import CustomizedUploadFileSuccess from "@views/upload/CustomizedUploadFileSuccess";

export default {
    name: "UploadMaterial",

    components: {CustomizedDialog, CustomizedUploadFileLoading, CustomizedUploadFileSuccess},

    mixins: [InfoFormMixin, TableHeightHandleMixin],

    created() {
        this.header = header;
    },

   deactivated() {
       this.$refs.uploadRuleForm.resetFields();
       this.tableData = [];
       this.$refs.upload.clearFiles();
    },

    data() {
        return {
            fileType,
            uploadRuleForm: {
                productName: "",
                industryName: ""
            },
            uploadRules: {
                productName: [
                    {required: true, message: "请选择产品名称"}
                ],
                industryName: [
                    {required: true, message: "请选择行业名称"}
                ],
            },
            tableData: [],
            loading: false,
            activeNames:['1'],
            fromPath: "/idea/material/videoLibrary",
            isUpload: false,
            isSuccess: false,
        }
    },

    computed: {
        ...mapState({
            token: state => state.global.token,
        })
    },

    beforeRouteEnter(to,from,next){
        next(vm => {
            vm.recordFromPath(from);
        })
    },

    beforeRouteUpdate(to,from,next){
        this.recordFromPath(from);
        next()
    },

    methods:{
        resetTableData(){
            this.tableData = [];
            this.$refs.uploadRuleForm.resetFields();
        },

        recordFromPath(from){
            if (from.matched.some(it => it.path === "/idea/material")) {
                this.fromPath = from.fullPath;
            }
        },

        commonDelivery(Url) {
            const obj = {
                product_id: this.uploadRuleForm.productName,
                industry_id: this.uploadRuleForm.industryName,
            };
            const formData = new FormData();
            Object.keys(obj).forEach(key => {
                formData.append(key, obj[key]);
            });
            const List = this.tableData.map((item, idx) => {
                this.revoke(item.fileUrl);
                formData.delete('file');
                formData.append('file', item.raw);
                return axios({
                    url: Url,
                    method: 'post',
                    data: formData,
                    processData: false,   // 告诉axios不要去处理发送的数据(重要参数)
                    contentType: false,   // 告诉axios不要去设置Content-Type请求头
                    headers: {
                        'Authorization': this.token
                    }
                })
            });
            return Promise.all(List);
        },

        //上传文件获取文件信息
        uploadSuccess(file) {
            file.type = file.raw.type.split('/')[0];
            file.fileUrl = URL.createObjectURL(file.raw);
            if (this.tableData.length === 0) {
                this.bottom = 52
                this.$nextTick(this.getOffset);
            }
            this.tableData.push(file);
        },

        beforeUpload(file){
            const uploadType = file.dataTransfer.files[0].type.split('/')[0];
            if((this.fromPath === "/idea/material/videoLibrary" && uploadType == 'image') || (this.fromPath === "/idea/material/pictureLibrary" && uploadType == 'video')){
                this.$message.warning("上传的文件类型有误");
            }
        },

        //释放
        revoke(url){
            URL.revokeObjectURL(url);
        },

        handleDelete(row) {
            this.revoke(row.fileUrl);
            this.tableData = this.tableData.filter(item => item.uid !== row.uid);
            this.tableData.forEach(item=>{
                item.type = item.raw.type.split('/')[0];
                item.fileUrl = URL.createObjectURL(item.raw);
            })
            this.$refs.upload.clearFiles();
        },

        handleSuccess() {
            this.$refs.uploadRuleForm.validate((valid)=>{
                if(valid){
                    this.$refs.uploadLoading.openDialog();
                    this.commonDelivery("/media/media/upload").then(res=>{
                        const idxs = [];
                        res.forEach(it => {
                            if (it.data.code !== 200) idxs.push(it);
                        })
                        this.$refs.uploadLoading.closeDialog();
                        if (idxs.length === 0) {
                            this.$refs.uploadSuccess.openDialog();
                        } else {
                            idxs.forEach(it => {
                                this.$message(it.data.msg);
                            })
                        }
                    })
                }else {
                    this.$message({
                        message:"你还有必选项未填！",
                        type:"warning"
                    })
                }
            })
        },
    }
}
</script>

<style scoped lang="scss">

    .setting-box {
        padding: 0;
        background: initial;
    }

    /deep/ .el-table::before{
        height: 0px;
    }

    /deep/ .el-table th.el-table__cell > .cell {
        color: $font-color-base;
        font-weight: $font-weight-bold;
    }

    /deep/ .el-table td:nth-child(1) .cell {
        padding-left: 10px;
    }

    /deep/ .el-collapse, /deep/ .el-collapse-item__wrap {
        border: none;
    }

    /deep/ .el-upload-dragger .el-icon-upload {
        color: $font-color-disabled;
    }

    /deep/ .el-input__inner::placeholder {
        font-size: $font-size-base;
        color: $font-color-secondary;
    }

    /deep/.el-select-dropdown__item.hover, .el-select-dropdown__item {
        font-size: $font-size-addition !important;
    }

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

    .toast {
        font-weight: $font-weight-base;
        font-size: $font-size-base;
        color: $font-color-base;
        p {
            text-align: center;
        }
    }

    .iconfont {
        font-size: $font-size-addition;
        color: $font-color-auxiliary;
    }

    .uniform-link {
        line-height: 44px;
    }

    .upload-file {

        padding-top: 24px;
        padding-bottom: 13px;

        /deep/ .el-input__inner {
            width: 230px;
            height: 36px;
        }
        /deep/ .el-form-item__label {
            color: $font-color-base;
        }

        .material {
            font-size: $font-size-headings;
            color: $font-color-base;
            font-weight: $font-weight-bold;
            margin: 2px 0px 18px;
        }

        /deep/.el-upload{
            width: 100%;
        }

        /deep/ .el-upload-dragger {
            width: 100%;
            background-color: $bg-color-grey;
            border: none;
            border-radius: 4px;
        }
    }

    /deep/ .el-collapse-item__header {
        border: none;
    }

    /deep/ .el-collapse-item__arrow.is-active :before {
        content: "收起  \e61b";
    }

    .table-content {
        align-items: center;
        min-height: 180px;
        overflow: auto;

        .img-url {
            /deep/ .el-image {
                width: 53px;
                height: 94px;
                img {
                    object-fit: contain
                }
            }
        }
    }

    /deep/.customized-table.el-table th.el-table__cell {
        background-color: $bg-color-grey;
    }

    .descriptions {
        p {
            color: $font-color-secondary;
            font-size: $font-size-base;
        }
    }

    .finish {
        margin: 10px;
    }
</style>
