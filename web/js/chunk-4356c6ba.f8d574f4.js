(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4356c6ba"],{d24e:function(t,i,e){"use strict";e.r(i);var a=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("customized-menu",{attrs:{menu:t.MATERIAL_LIST,breadcrumb:!1}},[e("keep-alive",[e("router-view",{key:t.fullPath})],1)],1)},n=[],o=e("fec4"),r=e("6c55"),E={name:"Material",data:function(){return{MATERIAL_LIST:o["d"],abc:123}},computed:{fullPath:function(){return this.$route.fullPath}},components:{CustomizedMenu:r["a"]}},c=E,u=e("cba8"),_=Object(u["a"])(c,a,n,!1,null,"4cc15fac",null);i["default"]=_.exports},fec4:function(t,i,e){"use strict";e.d(i,"a",(function(){return n})),e.d(i,"c",(function(){return o})),e.d(i,"e",(function(){return r})),e.d(i,"d",(function(){return E})),e.d(i,"b",(function(){return c}));var a=e("0a06"),n=[{title:"我的资料",iconfont:"profile"},{title:"修改密码",iconfont:"password"},{title:"下载中心",iconfont:"download-center"},{title:"退出登录",iconfont:"exit"}],o=[{authority:a["EXCLUDE_FINANCE_ROUTE_MASK"],path:"idea",title:"创意中心"},{authority:a["EXCLUDE_FINANCE_ROUTE_MASK"],path:"rank",title:"数据中心"},{authority:a["EXCLUDE_FINANCE_ROUTE_MASK"],path:"data",title:"数据大屏"},{authority:a["MANAGERS_ROUTE_MASK"],path:"settings",title:"工具"},{authority:a["FINANCE_CENTER_ROUTE_MASK"],path:"finance",title:"财务中心"}],r=[{authority:a["MANAGERS_ROUTE_MASK"],path:"user",title:"账号管理",iconfont:"icon-account"},{authority:a["MANAGERS_ROUTE_MASK"],title:"配置管理",path:"settings",iconfont:"icon-setting",children:[{authority:a["MANAGERS_ROUTE_MASK"],title:"行业",path:"industrySetting"},{authority:a["MANAGERS_ROUTE_MASK"],title:"产品",path:"productionSetting"},{authority:a["MANAGERS_ROUTE_MASK"],title:"媒体",path:"mediaSetting"},{authority:a["ADMIN_ROUTE_MASK"],title:"团队/部门",path:"teamSetting"}]},{authority:a["ADMIN_ROUTE_MASK"],path:"operateLog",title:"操作日志",iconfont:"icon-operate-log"}],E=[{authority:a["EXCLUDE_FINANCE_ROUTE_MASK"],title:"视频库",iconfont:"icon-video",path:"videoLibrary"},{authority:a["EXCLUDE_FINANCE_ROUTE_MASK"],title:"图片库",iconfont:"icon-picture",path:"pictureLibrary"}],c=[{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"数据总览",iconfont:"icon-first-page",path:"homePage"},{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"基础报表",iconfont:"icon-basics",path:"basicStatements",children:[{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"汇总报表",path:"summaryReport"},{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"计划报表",path:"planReport"},{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"消耗报表",path:"consumeReport"},{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"星图报表",path:"starMapReport"}]},{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"余额报表",iconfont:"icon-balance",path:"finance",children:[{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"余额查询",path:"balanceQuery"},{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"额度查询",path:"quotaQuery"}]},{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"广告主流水报表",iconfont:"icon-ad-stream",path:"adStreamReport"},{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"转账流水报表",iconfont:"icon-transfer-accounts",path:"transferStreamReport"},{authority:a["FINANCE_CENTER_ROUTE_MASK"],title:"返点结算行业报表",iconfont:"icon-settlement",path:"settlementReport"}]}}]);