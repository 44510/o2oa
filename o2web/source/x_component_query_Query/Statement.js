MWF.xApplication.query = MWF.xApplication.query || {};
MWF.xApplication.query.Query = MWF.xApplication.query.Query || {};
MWF.xDesktop.requireApp("query.Query", "Viewer", null, false);
MWF.xApplication.query.Query.Statement = MWF.QStatement = new Class({
    Extends: MWF.QViewer,
    options: {
    },
    initialize: function(container, json, options, app, parentMacro){
        //本类有三种事件，
        //一种是通过 options 传进来的事件，包括 loadView、openDocument、select
        //一种是用户配置的 事件， 在this.options.moduleEvents 中定义的作为类事件
        //还有一种也是用户配置的事件，不在this.options.moduleEvents 中定义的作为 this.node 的DOM事件

        this.setOptions(options);

        this.path = "../x_component_query_Query/$Viewer/";
        this.cssPath = "../x_component_query_Query/$Viewer/"+this.options.style+"/css.wcss";
        this._loadCss();
        this.lp = MWF.xApplication.query.Query.LP;

        this.app = app;

        this.container = $(container);
        this.json = json || {};

        this.parentMacro = parentMacro;

        this.originalJson = Object.clone(json);

        this.viewJson = null;
        this.filterItems = [];
        this.searchStatus = "none"; //none, custom, default


        this.items = [];
        this.selectedItems = [];
        this.hideColumns = [];
        this.openColumns = [];
        this.parameter = {};

        this.gridJson = null;

        if (this.options.isload){
            this.init(function(){
                this.load();
            }.bind(this));
        }

    },
    init: function(callback){
        if (this.json.view){
            this.viewJson = JSON.decode(this.json.view);
            if (callback) callback();
        }else{
            this.getView(callback);
        }
    },
    loadMacro: function (callback) {
        MWF.require("MWF.xScript.Macro", function () {
            this.Macro = new MWF.Macro.ViewContext(this);
            if (callback) callback();
        }.bind(this));
    },
    createActionbarNode : function(){
        this.actionbarAreaNode.empty();
        if( typeOf(this.json.showActionbar) === "boolean" && this.json.showActionbar !== true )return;
        if( typeOf( this.viewJson.actionbarHidden ) === "boolean" ){
            if( this.viewJson.actionbarHidden === true || !this.viewJson.actionbarList || !this.viewJson.actionbarList.length )return;
            this.actionbar = new MWF.xApplication.query.Query.Statement.Actionbar(this.actionbarAreaNode, this.viewJson.actionbarList[0], this, {});
            this.actionbar.load();
        }
    },
    _loadPageNode : function(){
        this.viewPageAreaNode.empty();
        if( !this.paging ){
            var json;
            if( !this.viewJson.pagingList || !this.viewJson.pagingList.length ){
                json = {
                    "firstPageText": this.lp.firstPage,
                    "lastPageText": this.lp.lastPage
                };
            }else{
                json = this.viewJson.pagingList[0];
            }
            this.paging = new MWF.xApplication.query.Query.Statement.Paging(this.viewPageAreaNode, json, this, {});
            this.paging.load();
        }else{
            this.paging.reload();
        }
    },
    // _initPage: function(){
    //     var i = this.count/this.json.pageSize;
    //     this.pages = (i.toInt()<i) ? i.toInt()+1 : i;
    //     this.currentPage = this.options.defaultPage || 1;
    //     this.options.defaultPage = null;
    // },
    lookup: function(data, callback){
        if( this.lookuping )return;
        this.lookuping = true;
        // this.getLookupAction(function(){
        //     if (this.json.application){

        var d = data || {};
        // d.count = this.json.count;
        // this.lookupAction.bundleView(this.json.id, d, function(json){
        //     this.bundleItems = json.data.valueList;

        // this._initPage();

        debugger;
        this.loadParameter();
        this.loadFilter( d );

        this.currentPage = this.options.defaultPage || 1;
        this.options.defaultPage = null;

        if( this.noDataTextNode )this.noDataTextNode.destroy();
        this.loadCurrentPageData( function (json) {
            if(this.count){
                this.fireEvent("postLoad"); //用户配置的事件
                this.lookuping = false;
                if(callback)callback(this);
            }else{
                this.viewPageAreaNode.empty();
                if( this.viewJson.noDataText ){
                    var noDataTextNodeStyle = this.css.noDataTextNode;
                    if( this.viewJson.viewStyles && this.viewJson.viewStyles["noDataTextNode"] ){
                        noDataTextNodeStyle = this.viewJson.viewStyles["noDataTextNode"];
                    }
                    this.noDataTextNode = new Element( "div", {
                        "styles": noDataTextNodeStyle,
                        "text" : this.viewJson.noDataText
                    }).inject( this.contentAreaNode );
                }
                // if (this.loadingAreaNode){
                //     this.loadingAreaNode.destroy();
                //     this.loadingAreaNode = null;
                // }
                this.fireEvent("postLoad"); //用户配置的事件
                this.lookuping = false;
                if(callback)callback(this);
            }


        }.bind(this), true,"all");

        // }.bind(this));
        // }
        // }.bind(this));
    },
    loadFilter : function( data ){
        debugger;
        this.filterList = [];
        ( data.filterList || [] ).each( function (d) {
            var parameterName = d.path.replace(/\./g, "_");
            var value = d.value;
            if( d.code && d.code.code ){
                value = this.Macro.exec( d.code.code, this);
            }
            if( d.comparison === "like" || d.comparison === "notLike" ){
                this.parameter[ parameterName ] = "%"+value+"%";
            }else{
                if( d.formatType === "dateTimeValue" || d.formatType === "datetimeValue"){
                    value = "{ts '"+value+"'}"
                }else if( d.formatType === "dateValue" ){
                    value = "{d '"+value+"'}"
                }else if( d.formatType === "timeValue" ){
                    value = "{t '"+value+"'}"
                }
                this.parameter[ parameterName ] = value;
            }
            d.value = parameterName;

            this.filterList.push( d );
        }.bind(this))
    },
    loadParameter : function(){
        this.parameter = {};
        ( this.viewJson.filterList || [] ).each( function (f) {
            var value = f.value;
            debugger;
            if( f.valueType === "script" ){
                value = this.Macro.exec( f.valueScript ? f.valueScript.code : "", this);
            }else if( f.value.indexOf( "@" ) > -1 ){
                var user = layout.user;
                switch ( f.value ) {
                    case "@person":
                        value = user.distinguishedName;
                        break;
                    case "@identityList":
                        value =  user.identityList.map( function (d) {
                            return d.distinguishedName;
                        });
                        break;
                    case "@unitList":
                        o2.Actions.load("x_organization_assemble_express").UnitAction.listWithPerson({ "personList" : [user.distinguishedName] }, function (json) {
                            value = json.unitList;
                        }, null, false);
                        break;
                    case "@unitAllList":
                        o2.Actions.load("x_organization_assemble_express").UnitAction.listWithIdentitySupNested({ "personList" : [user.distinguishedName] }, function (json) {
                            value = json.unitList;
                        }, null, false);
                        break;
                    case "@year":
                        value = (new Date().getFullYear()).toString();
                        break;
                    case "@season":
                        var m = new Date().format("%m");
                        if( ["01","02","03"].contains(m) ){
                            value = "1"
                        }else if( ["04","05","06"].contains(m) ){
                            value = "2"
                        }else if( ["07","08","09"].contains(m) ){
                            value = "3"
                        }else{
                            value = "4"
                        }
                        break;
                    case "@month":
                        value = new Date().format("%Y-%m");
                        break;
                    case "@time":
                        value = new Date().format("db");
                        break;
                    case "@date":
                        value = new Date().format("%Y-%m-%d");
                        break;
                    default:
                }
            }
            if( f.formatType === "dateTimeValue" || f.formatType === "datetimeValue"){
                value = "{ts '"+value+"'}"
            }else if( f.formatType === "dateValue" ){
                value = "{d '"+value+"'}"
            }else if( f.formatType === "timeValue" ){
                value = "{t '"+value+"'}"
            }
            this.parameter[ f.parameter ] = value;
        }.bind(this))
    },
    loadCurrentPageData: function( callback, async, type ){
        //是否需要在翻页的时候清空之前的items ?

        debugger;

        if( this.pageloading )return;
        this.pageloading = true;

        this.items = [];

        var p = this.currentPage;
        var d = {
            "filterList" : this.filterList,
            "parameter" : this.parameter
        };

        while (this.viewTable.rows.length>1){
            this.viewTable.deleteRow(-1);
        }
        //this.createLoadding();

        this.loadViewRes = o2.Actions.load("x_query_assemble_surface").StatementAction.executeV2(
            this.options.statementId || this.options.statementName || this.json.statementId || this.json.statementName,
            type || "data", p, this.json.pageSize, d, function(json){

                if( type === "all" || type === "count" ){
                    if( typeOf(json.count) === "number" ){
                        this.count = json.count;
                        var i = this.count/this.json.pageSize;
                        this.pages = (i.toInt()<i) ? i.toInt()+1 : i;
                    }
                }

                this.gridJson = json.data;

                this.fireEvent("postLoadPageData");

                // if (this.viewJson.group.column){
                //     this.gridJson = json.data.groupGrid;
                // }else{
                //     this.gridJson = json.data.grid;
                this.loadData();
                // }
                if (this.gridJson.length) this._loadPageNode();
                if (this.loadingAreaNode){
                    this.loadingAreaNode.destroy();
                    this.loadingAreaNode = null;
                }

                this.pageloading = false;

                this.fireEvent("loadView"); //options 传入的事件
                this.fireEvent("postLoadPage");

                if(callback)callback( json );
            }.bind(this), null, async === false ? false : true );
    },
    getView: function(callback){
        this.getViewRes = o2.Actions.load("x_query_assemble_surface").StatementAction.get(this.json.statementId || this.json.statementName, function(json){
            debugger;
            var viewData = JSON.decode(json.data.view);
            if( !this.json.pageSize )this.json.pageSize = viewData.pageSize;
            this.viewJson = viewData.data;
            this.json.application = json.data.query;
            //this.json = Object.merge(this.json, json.data);
            this.statementJson = json.data;
            if (callback) callback();
        }.bind(this));
    },

    loadData: function(){
        if (this.gridJson.length){
            // if( !this.options.paging ){
            this.gridJson.each(function(line, i){
                this.items.push(new MWF.xApplication.query.Query.Statement.Item(this, line, null, i));
            }.bind(this));
            // }else{
            //     this.loadPaging();
            // }
        }else{
            if (this.viewPageAreaNode) this.viewPageAreaNode.empty();
        }
    },
    loadDataByPaging : function(){
        if( this.isItemsLoading )return;
        if( !this.isItemsLoaded ){
            var from = Math.min( this.pageNumber * this.options.perPageCount , this.gridJson.length);
            var to = Math.min( ( this.pageNumber + 1 ) * this.options.perPageCount + 1 , this.gridJson.length);
            this.isItemsLoading = true;
            for( var i = from; i<to; i++ ){
                this.items.push(new MWF.xApplication.query.Query.Statement.Item(this, this.gridJson[i], null, i));
            }
            this.isItemsLoading = false;
            this.pageNumber ++;
            if( to == this.gridJson.length )this.isItemsLoaded = true;
        }
    },
    getFilter: function(){
        var filterData = [];
        if (this.searchStatus==="custom"){
            if (this.filterItems.length){
                this.filterItems.each(function(filter){
                    filterData.push(filter.data);
                }.bind(this));
            }
        }
        if (this.searchStatus==="default"){
            var key = this.viewSearchInputNode.get("value");
            if (key && key!==this.lp.searchKeywork){
                this.viewJson.customFilterList.each(function(entry){
                    if (entry.formatType==="textValue"){
                        var d = {
                            "path": entry.path,
                            "value": key,
                            "formatType": entry.formatType,
                            "logic": "and",
                            "comparison": "like"
                        };
                        filterData.push(d);
                    }
                    if (entry.formatType==="numberValue"){
                        var v = key.toFloat();
                        if (!isNaN(v)){
                            var d = {
                                "path": entry.path,
                                "value": v,
                                "formatType": entry.formatType,
                                "logic": "and",
                                "comparison": "like"
                            };
                            filterData.push(d);
                        }
                    }
                }.bind(this));
            }
        }
        return (filterData.length) ? filterData : null;
    },
    viewSearchCustomAddToFilter: function(){
        var pathIdx = this.viewSearchCustomPathListNode.selectedIndex;
        var comparisonIdx = this.viewSearchCustomComparisonListNode.selectedIndex;
        if (pathIdx===-1){
            MWF.xDesktop.notice("error", {"x": "left", "y": "top"}, this.lp.filterErrorTitle, this.viewSearchCustomPathListNode, {"x": 0, "y": 85});
            return false;
        }
        if (comparisonIdx===-1){
            MWF.xDesktop.notice("error", {"x": "left", "y": "top"}, this.lp.filterErrorComparison, this.viewSearchCustomComparisonListNode, {"x": 0, "y": 85});
            return false;
        }
        var pathOption = this.viewSearchCustomPathListNode.options[pathIdx];
        var entry = pathOption.retrieve("entry");
        if (entry){
            var pathTitle = entry.title;
            var path = entry.path;
            var comparison = this.viewSearchCustomComparisonListNode.options[comparisonIdx].get("value");
            var comparisonTitle = this.viewSearchCustomComparisonListNode.options[comparisonIdx].get("text");
            var value = "";

            if( entry.valueType === "script" && entry.valueScript && entry.valueScript.code  ){
                var idx = this.viewSearchCustomValueNode.selectedIndex;
                if (idx!==-1){
                    var v = this.viewSearchCustomValueNode.options[idx].get("value");
                    value = entry.formatType === "booleanValue" ? (v==="true") : v;
                }
            }else{
                switch (entry.formatType){
                    case "numberValue":
                        value = this.viewSearchCustomValueNode.get("value");
                        break;
                    case "dateTimeValue":
                        value = this.viewSearchCustomValueNode.get("value");
                        break;
                    case "booleanValue":
                        var idx = this.viewSearchCustomValueNode.selectedIndex;
                        if (idx!==-1){
                            var v = this.viewSearchCustomValueNode.options[idx].get("value");
                            value = (v==="true");
                        }
                        break;
                    default:
                        value = this.viewSearchCustomValueNode.get("value");
                }
            }

            if (value===""){
                MWF.xDesktop.notice("error", {"x": "left", "y": "top"}, this.lp.filterErrorValue, this.viewSearchCustomValueContentNode, {"x": 0, "y": 85});
                return false;
            }

            this.filterItems.push(new MWF.xApplication.query.Query.Statement.Filter(this, {
                "logic": "and",
                "path": path,
                "title": pathTitle,
                "comparison": comparison,
                "comparisonTitle": comparisonTitle,
                "value": value,
                "formatType": (entry.formatType=="datetimeValue") ? "dateTimeValue": entry.formatType
            }, this.viewSearchCustomFilterContentNode));

            this.searchCustomView();
        }
    },
    //搜索相关结束
    getStatementInfor : function () {
        return this.json;
    },
    switchStatement : function (json) {
        this.switchView(json);
    }
});

MWF.xApplication.query.Query.Statement.Item = new Class({
    Extends : MWF.xApplication.query.Query.Viewer.Item,
    initialize: function(view, data, prev, i){
        this.view = view;
        this.data = data;
        this.css = this.view.css;
        this.isSelected = false;
        this.prev = prev;
        this.idx = i;
        this.clazzType = "item";

        this.load();
    },
    load: function(){
        this.view.fireEvent("queryLoadItemRow", [null, this]);

        var viewStyles = this.view.viewJson.viewStyles;
        var viewContentTdNode = ( viewStyles && viewStyles["contentTd"] ) ? viewStyles["contentTd"] : this.css.viewContentTdNode;

        this.node = new Element("tr", {
            "styles": ( viewStyles && viewStyles["contentTr"] ) ? viewStyles["contentTr"] : this.css.viewContentTrNode
        });
        if (this.prev){
            this.node.inject(this.prev.node, "after");
        }else{
            this.node.inject(this.view.viewTable);
        }

        //if (this.view.json.select==="single" || this.view.json.select==="multi"){
        this.selectTd = new Element("td", { "styles": viewContentTdNode }).inject(this.node);
        this.selectTd.setStyles({"cursor": "pointer"});
        if (this.view.json.itemStyles) this.selectTd.setStyles(this.view.json.itemStyles);
        if( this.view.isSelectTdHidden() ){
            this.selectTd.hide();
        }
        //}

        //序号
        if (this.view.viewJson.isSequence==="yes"){
            this.sequenceTd = new Element("td", {"styles": viewContentTdNode}).inject(this.node);
            this.sequenceTd.setStyle("width", "10px");
            var s= 1+this.view.json.pageSize*(this.view.currentPage-1)+this.idx;
            this.sequenceTd.set("text", s);
        }

        debugger;

        Object.each(this.view.entries, function(c, k){
            //if (cell){
            if (this.view.hideColumns.indexOf(k)===-1){
                var td = new Element("td", {"styles": viewContentTdNode}).inject(this.node);

                var cell =  this.getText( c, k, td ); //this.data[k];
                if (cell === undefined || cell === null) cell = "";

                // if (k!== this.view.viewJson.group.column){
                var v = cell;
                if (c.isHtml){
                    td.set("html", v);
                }else{
                    td.set("text", v);
                }

                if( typeOf(c.contentProperties) === "object" )td.setProperties(c.contentProperties);
                if (this.view.json.itemStyles) td.setStyles(this.view.json.itemStyles);
                if( typeOf(c.contentStyles) === "object" )td.setStyles(c.contentStyles);
                // }else{
                //     if (this.view.json.itemStyles) td.setStyles(this.view.json.itemStyles);
                // }

                if (this.view.openColumns.indexOf(k)!==-1){
                    this.setOpenWork(td, c)
                }

                // if (k!== this.view.viewJson.group.column){
                Object.each( c.events || {}, function (e , key) {
                    if(e.code){
                        if( key === "loadContent" ){
                            this.view.Macro.fire( e.code,
                                {"node" : td, "json" : c, "data" : v, "view": this.view, "row" : this});
                        }else if( key !== "loadTitle" ){
                            td.addEvent(key, function(event){
                                return this.view.Macro.fire(
                                    e.code,
                                    {"node" : td, "json" : c, "data" : v, "view": this.view, "row" : this},
                                    event
                                );
                            }.bind(this));
                        }
                    }
                }.bind(this));
                // }
            }
            //}
        }.bind(this));

        //默认选中
        var defaultSelectedScript = this.view.json.defaultSelectedScript || this.view.viewJson.defaultSelectedScript;
        if( !this.isSelected && defaultSelectedScript ){
            // var flag = this.view.json.select || this.view.viewJson.select ||  "none";
            // if ( flag ==="single" || flag==="multi"){
            //
            // }
            var flag = this.view.Macro.exec( defaultSelectedScript,
                {"node" : this.node, "data" : this.data, "view": this.view, "row" : this});
            if( flag ){
                if( flag === "multi" || flag === "single" ){
                    this.select( flag );
                }else if( flag.toString() === "true" ){
                    var f = this.view.json.select || this.view.viewJson.select ||  "none";
                    if ( f ==="single" || f==="multi"){
                        this.select();
                    }
                }
            }
        }

        this.setEvent();

        this.view.fireEvent("postLoadItemRow", [null, this]);
    },
    getText : function(c, k, td){
        var path = c.path, code = c.code, obj = this.data;
        if( path ){
            var pathList = path.split(".");
            for( var i=0; i<pathList.length; i++ ){
                var p = pathList[i];
                if( (/(^[1-9]\d*$)/.test(p)) )p = p.toInt();
                if( obj[ p ] ){
                    obj = obj[ p ];
                }else{
                    obj = "";
                    break;
                }
            }
        }

        if( code && code.trim())obj = this.view.Macro.exec( code, {"value": obj,  "data": this.data, "entry": c, "node" : td, "json" : c, "row" : this});

        var toName = function (value) {
            if(typeOf(value) === "array"){
                Array.each( value, function (v, idx) {
                    value[idx] = toName(v)
                })
            }else if( typeOf(value) === "object" ){
                Object.each( value, function (v, key) {
                    value[key] = toName(v);
                })
            }else if( typeOf( value ) === "string" ){
                value = o2.name.cn( value )
            }
            return value;
        };

        var d;
        if( obj!= undefined && obj!= null ){
            if( typeOf(obj) === "array" ) {
                d = c.isName ? JSON.stringify(toName(Array.clone(obj))) : JSON.stringify(obj);
            }else if( typeOf(obj) === "object" ){
                d = c.isName ? JSON.stringify(toName(Object.clone(obj))) : JSON.stringify(obj);
            }else{
                d = c.isName ? o2.name.cn( obj.toString() ) : obj;
            }
        }

        return d;
    },
    setOpenWork: function(td, column){
        td.setStyle("cursor", "pointer");
        if( column.clickCode ){
            if( !this.view.Macro ){
                MWF.require("MWF.xScript.Macro", function () {
                    this.view.businessData = {};
                    this.view.Macro = new MWF.Macro.PageContext(this.view);
                }.bind(this), false);
            }
            td.addEvent("click", function( ev ){
                var result = this.view.Macro.fire(column.clickCode, this, ev);
                ev.stopPropagation();
                return result;
            }.bind(this));
        }else{
            // if (this.view.json.type==="cms"){
            //     td.addEvent("click", function(ev){
            //         this.openCms(ev)
            //         ev.stopPropagation();
            //     }.bind(this));
            // }else{
            td.addEvent("click", function(ev){
                this.openWorkAndCompleted(ev)
                ev.stopPropagation();
            }.bind(this));
            // }
        }
    }
});

MWF.xApplication.query.Query.Statement.Filter = new Class({
    Extends : MWF.xApplication.query.Query.Viewer.Filter
});

MWF.xApplication.query.Query.Statement.Actionbar = new Class({
    Extends : MWF.xApplication.query.Query.Viewer.Actionbar
});

MWF.xApplication.query.Query.Statement.Paging = new Class({
    Extends : MWF.xApplication.query.Query.Viewer.Paging
});