(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1cfd3379"],{"18f6":function(t,e,i){},"4bbd":function(t,e,i){"use strict";e["a"]={data:function(){return{pageSize:10,total:0,currentPage:1,header:null,tableData:[],loading:!1}},mounted:function(){},methods:{pageChange:function(t,e,i){this.currentPage=i,t.call(e,i)},pageSizeChange:function(t,e,i){this.pageSize=i,this.pageChange(t,e,1)}}}},"866e":function(t,e,i){"use strict";i("18f6")},fc82:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"h-100 overflow-auto-y flex-vertical"},[i("div",{staticClass:"flex-space-between m-m-16"},t._l(t.statusPool,(function(e,s){return i("div",{key:s,staticClass:"flex-all-center status-bar background-white border-radius-4",on:{click:function(i){return t.changeStatus(e)}}},["orderTable"===t.routeName&&e.mask&t.curStatus?i("div",{staticClass:"status-light",style:{background:e.color}}):t._e(),i("svg-icon",{staticClass:"icon border-radius-50 inline-block",attrs:{"icon-name":e.icon}}),i("div",{staticClass:"inline-block"},[i("div",{staticClass:"desc"},[t._v(t._s(e.desc+"（个）"))]),i("div",{staticClass:"count"},[t._v(t._s(e.count))])])],1)})),0),i("div",{staticClass:"m-m-16 table-wrapper custom-block p-m-16 m-t-0 background-white border-radius-4 flex-1 flex-vertical"},[i("div",{staticClass:"top-button customized-button"},[i("el-button",{staticClass:"orderTable",attrs:{type:"primary",plain:"orderTable"!==t.routeName},on:{click:function(e){return t.routeTo("orderTable")}}},[t._v("订单列表")]),i("el-button",{staticClass:"videoTable",attrs:{type:"primary",plain:"videoTable"!==t.routeName},on:{click:function(e){return t.routeTo("videoTable")}}},[t._v("视频数据表")]),i("el-button",{attrs:{type:"primary",plain:""},on:{click:function(e){return t.routeTo("material")}}},[t._v("素材库")])],1),i("keep-alive",[i("router-view",{key:t.routeViewKey})],1)],1),i("customized-dialog",{staticClass:"first-login",attrs:{title:"新人指引",visible:t.firstLoginDialogVisible,modal:!1,fullscreen:!0,clickModal:!1},on:{close:t.resetDialog}},[i("p",[t._v("您好，这里有一份新人指引文件待查收哦～")]),i("el-button",{staticClass:"f-r customized-button m-t-20",attrs:{type:"primary"},on:{click:t.firstLogin}},[t._v("点击查看")])],1)],1)},a=[],o=i("cc64"),r=(i("6010"),i("7736")),n=i("2554"),u=i("4bbd"),l={name:"Order",mixins:[u["a"]],computed:Object(o["a"])(Object(o["a"])({},Object(r["b"])({curStatus:function(t){return t.order.curStatus}})),{},{routeName:function(){return this.$route.name},routeViewKey:function(){return this.$route.path+"production"==="production"?"":(new Date).getTime()}}),mounted:function(){this.handleLoginTime()},data:function(){return{statusPool:null,OrderStatus:[],statusValue:"",statusFlag:!0,firstLoginDialogVisible:!1}},created:function(){this.statusPool=n["TopStatus"]},methods:{handleLoginTime:function(){1===this.$store.state.global.loginTime&&(this.firstLoginDialogVisible=!0)},firstLogin:function(){this.firstLoginDialogVisible=!1,this.routeTo("guide")},routeTo:function(t){this.$router.push({name:t})},changeStatus:function(t){this.statusValue===t.value&&!1===this.statusFlag?(this.$store.commit("setOrderStatus",n["STATUS_EMPTY"]),this.$store.commit("setOrderStatusValue","null"),this.statusFlag=!this.statusFlag):"orderTable"!==this.routeName?this.routeTo("orderTable"):(this.$store.commit("setOrderStatus",t.mask),this.$store.commit("setOrderStatusValue",t.value),this.statusValue=t.value,this.statusFlag=!this.statusFlag)},resetDialog:function(){this.firstLoginDialogVisible=!1}}},c=l,d=(i("866e"),i("cba8")),b=Object(d["a"])(c,s,a,!1,null,"1a0591fc",null);e["default"]=b.exports}}]);