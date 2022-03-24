<template>
    <!-- 表格区 -->
    <customized-table
        :showPagination="false"
        :Data="tableData"
        :Header="header"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        :loading="loading"
        table-height="320px"
        class="dark-table"
        ref="table"
        @mouseenter.native="endSwipe"
        @mouseleave.native="checkSwipe"
    >
        <template v-slot:order_name="{row}">
            <span class="ell-1" :title="row.order_name">{{row.order_name}}</span>
        </template>
    </customized-table>
    <!-- /表格区 -->
</template>

<script>
    import PaginationMixin from "@mixins/PaginationMixin";
    import {HEADER, PageSize, RowHeight, animationDuration} from "@views/Data/MakingOrder/MakingOrder.js";

    export default {
        name: "MakingOrder",
        mixins: [PaginationMixin],
        created() {
            this.header = HEADER;
        },
        mounted(){
            this.getData();
        },
        destroyed(){
            this.endSwipe();
        },
        data(){
            return {
                timerId: 0,
                translateY: 0,
                loading: false
            }
        },
        methods:{
            swipeHandler(){
                const pages = Math.ceil(this.tableData.length / PageSize);
                const pageHeight = PageSize * RowHeight;
                this.translateY = (this.translateY + pageHeight) % (pages * pageHeight);
                const table = this.$refs.table.$refs.customizedTable.$refs.bodyWrapper.firstElementChild;
                table.setAttribute('style',`transform:translate3d(0,-${this.translateY}px,0);transition:transform 500ms;`);
                if (!this.translateY) {
                    this.endSwipe();
                    this.getData();
                }
            },
            startSwipe(){
                this.timerId = setInterval(this.swipeHandler,animationDuration);
            },
            checkSwipe(){
                if (!this.timerId && !this.loading) this.startSwipe();
            },
            endSwipe(){
                if (this.timerId) {
                    clearInterval(this.timerId);
                    this.timerId = 0;
                }
            },
            getData(){
                this.loading = true;
                this.$http.get("/report/screen/order-list").then(res=>{
                    if (res.data.code === 200) {
                        this.tableData = res.data.data.list;
                        this.endSwipe();
                        this.startSwipe();
                    }
                }).finally(()=>{
                    this.loading = false;
                })
            }
        }

    }
</script>

<style scoped lang="scss">
    .dark-table {
        /deep/ .el-table__body-wrapper {
            overflow: hidden;
            max-height: 290px !important;
        }

        /deep/ .el-table__body-wrapper .el-table__cell {
            padding: 3px 0;
        }
    }
</style>
