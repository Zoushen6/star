<template>
    <!-- 表格区 -->
    <customized-table
        :showPagination="false"
        :loading="inheritLoading"
        :Data="tableData"
        :Header="header"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        table-height="320px"
        class="dark-table"
    >
        <template v-slot:rank="{row}">
            <svg-icon v-if="showRankIcon(row.rank)" :icon-name="rankIcons[row.rank]">
            </svg-icon>
            <span :class="showRankIcon(row.rank)?'offset':''">{{row.rank}}</span>
        </template>
        <template v-slot:title="{row}">
            <el-popover
                placement="top-start"
                width="120"
                trigger="hover"
                popper-class="cost-rank-detail"
                :content="row.title"
            >
                <el-link slot="reference" @click="redirectTo(row)"><span class="ell-1">{{row.title}}</span></el-link>
            </el-popover>
        </template>
        <template v-slot:group_name="{row}">
            <el-popover
                placement="top-start"
                width="120"
                trigger="hover"
                popper-class="cost-rank-detail"
                :content="row.group_name"
            >
                <span slot="reference" class="ell-1 pointer">{{row.group_name}}</span>
            </el-popover>
        </template>
    </customized-table>
    <!-- /表格区 -->
</template>

<script>
    import PaginationMixin from "@mixins/PaginationMixin";
    import {HEADER, RankIcons} from "@views/Data/CostRank/CostRank.js";

    export default {
        name: "CostRank",
        mixins: [PaginationMixin],
        created() {
            this.header = HEADER;
        },
        props: {
            data: Array,
            inheritLoading: {
                type: Boolean,
                default: false
            },
        },
        watch: {
            data: function (val) {
                this.tableData = val.map((item, idx) => Object.assign(item, {rank: idx + 1}));
            }
        },
        computed:{
            rankIcons:function () {
                return RankIcons;
            }
        },
        methods: {
            showRankIcon(rank) {
                return rank <= 3;
            },

            redirectTo(row){
                const params = {
                    advertiser_id: row.advertiser_id,
                    channel: row.channel
                };
                if (Number(row.channel) === 1) {
                    params.material_id = row.material_id;
                } else {
                    params.photo_id = row.photo_id;
                }
                this.$router.push({
                    name: "rank",
                    params
                });
            }
        }
    }
</script>

<style scoped lang="scss">

    .dark-table {
        /deep/ .el-table__body-wrapper .el-table__cell {
            padding: 2px 0;
        }
    }

    /deep/ .el-link {
        color: inherit;
        font-size: inherit;

        &:hover {
            color: inherit;
        }
    }

    .icon {
        width: 23px;
        height: 20px;
        display: inline-block;
        transform: translate(5px, 4px);
    }

    .offset {
        color: white;
        display: inline-block;
        transform: translate(-10px, 2px) scale(0.7);
    }

</style>
