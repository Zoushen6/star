<template>
    <div class="box">
        <div class="upload-box">
            <p class="icon-delivery">
                <img :src="pic" />
            </p>
            <p class="upload-button">
                <el-button class="iconfont icon-upload customized-button" @click="upload">上传文件</el-button>
            </p>
        </div>
    </div>
</template>

<script>

    export default {
        name: "UploadFile",

        data(){
            return {
                visibleUpload: false,
                pic: require('@/assets/upload.png')
            }
        },

        methods:{
            upload(){
                this.$emit('upload');
            },
        }
    }
</script>

<style scoped lang="scss">
    .box {
        .upload-box{
            border-radius: 4px;
            height: 240px;
            background-color: $bg-color-grey;
            position: relative;
            .upload-button {
                position: absolute;
                top: 50%;
                left: 50%;
            }
            .icon-delivery {
                position: absolute;
                top: 20%;
                left: 51%;
                img {
                    width: 67px;
                }
            }
        }
        .customized-button {
            border-color: $theme-color;
            color: $theme-color;
        }
    }
</style>