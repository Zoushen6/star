export default {
    data() {
        return {
            //视频弹窗
            dialogWidth: 1200,
            videoLoading:false,
            visiblePreviewDialog:false,
            videoUrl:'',
            dialogUrl:''
        }
    },
    methods:{
        handleDialogOpened(){
            this.videoUrl = this.dialogUrl;
            this.addEventListener();
        },

        resizePreviewDialog(){
            this.dialogWidth = this.$refs.previewVideo.clientWidth + 40;
        },

        addEventListener(){
            this.$refs.previewVideo.addEventListener('loadeddata',this.resizePreviewDialog)
        },

        removeEventListener(){
            this.$refs.previewVideo.removeEventListener('loadeddata',this.resizePreviewDialog)
        },

        resetPreviewDialog(){
            this.videoUrl = '';
            this.videoInfo = '';
            this.removeEventListener();
        },
    }
}
