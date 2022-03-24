<template>
    <customized-dialog
        class="customized-dialog"
        title="上传文件"
        :width="1004"
        :visible="dialogVisible"
        @close="closeDialog"
    >
        <el-form class="form">
            <span class="dialog-blue-title inline-block">基础信息</span>
            <el-form-item>
                <span class="member-title">编导：</span>
                <el-select v-model="choreographer" placeholder="请选择">
                    <el-option
                        v-for="(item,index) in member_list.choreographer_list"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <span class="member-title">摄影：</span>
                <el-select v-model="photography" placeholder="请选择">
                    <el-option
                        v-for="(item,index) in member_list.photography_list"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <span class="member-title">剪辑：</span>
                <el-select v-model="montage" placeholder="请选择">
                    <el-option
                        v-for="(item,index) in member_list.montage_list"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <span class="member-title">平面：</span>
                <el-select v-model="graphicDesign" placeholder="请选择">
                    <el-option
                        v-for="(item,index) in member_list.graphicDesign_list"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <span class="dialog-blue-title inline-block upload-title">上传素材</span>
            <el-form-item>
                <el-upload
                    class="flex-1"
                    :drag="true"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :accept="fileTypes===1?fileType.video:fileType.image"
                    :on-change="uploadSuccess"
                    @drop.native="beforeUpload"
                    :auto-upload="false"
                    :show-file-list="false"
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
            <div class="description">
                <p>1. 文件名50字以内，可由“汉字、英文、数字”组成，不要使用特殊符号 如“-、～、！、< 等”</p>
                <p>2. 视频格式为mp4：宽高比16：9，大小≤1000M，时长24s到300s之间</p>
                <p> 3. 图片格式为jpg、jpeg、png，宽高比16：9.</p>
            </div>
            <div v-for="(ite,idx) in fileList" :key="idx" class="list m-b-10">
                <span>{{idx+1}}.&nbsp;&nbsp;{{ite.name}}</span>
                <span>{{ite.size | size}}</span>
                <span @click="deleteItem(idx)" class="pointer">删除</span>
            </div>
            <el-form-item class="finish" v-if="fileList.length!==0">
                <el-button class="customized-button" type="primary" @click="uploadFinish">完成</el-button>
            </el-form-item>
        </el-form>
    </customized-dialog>
</template>

<script>
import {fileType} from "@tools/FileType";
import DialogMixin from "@mixins/DialogMixin";
import axios from "axios";
import { mapState } from "vuex";

export default {
    name: "DeliveryUploadDialog",

    mixins: [DialogMixin],

    props:{
        fileTypes:{
            type:Number
        },
        isResubmit: {
            type: [Number,Boolean],
        }
    },

    computed: {
        ...mapState({
            token: state => state.global.token,
        })
    },

    data(){
        return {
            fileType,
            member_list: {
                choreographer_list: [],
                photography_list: [],
                montage_list: [],
                graphicDesign_list: [],
            },
            choreographer: "",
            photography: "",
            montage: "",
            graphicDesign: "",
            fileList: [],
            type: '',
            isUpload: false,
            isSuccess: false,
            memberList: null
        }
    },

    created() {
        this.memberList = Object.assign({},{...this.member_list})
    },

    mounted: async function () {
        await this.groupMemberList();
    },

    methods:{

        resetData(){
            this.fileList = [];
            this.choreographer = '';
            this.montage = '';
            this.photography = '';
            this.graphicDesign = '';
        },

        groupMemberList: async function () {
            const res = await this.$http.get("/group/group-member-list");
            if (res.data.code === 200) {
                this.member_list = {...this.member_list};
                this.member_list = {...res.data.data.member_list};
            }
        },

        //上传文件获取文件信息
        uploadSuccess(file) {
            const type = file.raw.type.split('/')[0];
            // 选择上传文件限制
            if((this.fileTypes === 1 && type !== 'video') || (this.fileTypes === 2 && type !== 'image')){
                this.$message.warning("上传的文件类型有误");
                return;
            }
            file.type = type;
            file.fileUrl = URL.createObjectURL(file.raw);
            this.fileList.push(file);
        },

        beforeUpload(file){
            // 拖拽上传文件限制
            const uploadType = file.dataTransfer.files[0].type.split('/')[0];
            if((this.fileTypes === 1 && uploadType !== 'video') || (this.fileTypes === 2 && uploadType !== 'image')){
                this.$message.warning("上传的文件类型有误");
            }
        },

        deleteItem(idx){
            this.fileList.splice(idx,1);
        },

        commonDelivery(Url) {
            const obj = {
                order_id: this.$route.query.order_id,
                choreographer_id: this.choreographer ? this.choreographer : 0,
                photography_id: this.photography ? this.photography : 0,
                design_id: this.graphicDesign ? this.graphicDesign : 0,
                montage_id: this.montage ? this.montage : 0,
            };
            const formData = new FormData();
            Object.keys(obj).forEach(key => {
                formData.append(key, obj[key]);
            });
            const list = this.fileList.map((item, idx) => {
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
            return Promise.all(list);
        },

        uploadFinish(){
            if((this.choreographer || this.photography || this.montage || this.graphicDesign) && this.fileList.length !== 0){
                this.$emit('openUploadLoading');
                let url = this.isResubmit? '/order/repeat-video-delivery': '/order/video-delivery';
                this.commonDelivery(url).then(res => {
                    const idxs = [];
                    res.forEach(it => {
                        if (it.data.code !== 200) idxs.push(it);
                    });
                    this.$emit('closeUploadLoading');
                    this.resetData();
                    if (idxs.length === 0) {
                        this.$emit('uploadFinish');
                    } else if(idxs.length < res.length) {
                        this.$emit('updateDetail');
                    }else {
                        let arr = [];
                        idxs.forEach((it,index) => {
                            arr.push(index+1,it.data.msg)
                        })
                        this.$message({
                            type:'warning',
                            duration: 5000,
                            message:'上传失败：' + arr.join(',') + '已重复上传！'
                        })
                    }
                })
            }else {
                this.$message({
                    message:"最少选择一名团队成员，没有的则选无",
                    type:"warning"
                })
            }
        },
    }
}
</script>

<style scoped lang="scss">

    /deep/.form {
        .dialog-blue-title {
            padding-left: 8px;
        }
        .upload-title {
            margin-bottom: 20px;
        }
        .description {
            margin-top: -15px;
            p {
                font-size: $font-size-addition;
                color: $font-color-auxiliary;
            }
        }
        .list {
            display: grid;
            grid-template-columns: repeat(3,1fr);
            grid-gap: 10px;
            border: 1px solid $bg-color-divider;
            padding: 11px;
            background-color: #FAFAFA;
            .pointer {
                color: $color-link;
            }
        }
        .finish {
            margin-bottom: 0;
        }
        .el-form-item {
            text-align: center;
            .member-title {
                height: 38px;
                line-height: 38px;
                font-weight: $font-weight-base;
                font-size: $font-size-base;
                vertical-align: middle;
            }
            .el-select {
                width: 314px;
                height: 36px;
            }
            .el-input__inner {
                border-radius: 4px;
            }
            .el-upload-dragger {
                width: 965px;
                height: 102px;
                background-color: $bg-color-grey;
                border: 1px dashed $bg-color-grey;
                border-radius: 4px;
                .el-icon-upload {
                    color: $font-color-disabled;
                    font-size: 45px;
                    margin-top: 30px;
                    line-height: 0px;
                }
                .el-upload__text {
                    margin-top: -10px;
                }
            }
            .customized-button {
                margin: 0 auto;
            }
        }
    }
</style>