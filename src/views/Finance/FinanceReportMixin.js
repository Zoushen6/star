export default {
    data() {
        return {
            export:'',
            order: null,
            sort: null,
            minDate: Math.ceil((new Date - new Date("2018-1-1")) / (3600 * 24 * 1000)),
            shortcutsSetting: ['yesterday', 'lastSeven', 'lastThirty', 'lastWeek', 'lastMonth'],
        }
    },
    mounted() {
    },
    methods: {

        sortChangeHandle(data){
            if (data.order) {
                this.order = data.prop;
                this.sort = data.order === 'descending' ? 'desc' : 'asc';
            } else {
                this.order = null;
                this.sort = null;
            }
            this.tableLoad();
        },

        downloadReport(val){
            this.export = val;
            if(this.tableData.length === 0)
                this.$message.warning('没有数据可以下载')
            else
                this.requestTable().then(res=>{
                    if(res.data.code === 200){
                        const path = this.$router.resolve({name:"downloadCenter"}).href;
                        this.$message.success({
                            dangerouslyUseHTMLString: true,
                            message: `已添加到下载中心，请到<a class="redirect-download" href=${path}>下载中心</a>查看`
                        })
                    }
                })
            this.export = '';
        },

        search() {
            this.tableLoad();
        },

    }
}