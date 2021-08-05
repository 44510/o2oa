MWF.xApplication.process.FormDesigner.Module = MWF.xApplication.process.FormDesigner.Module || {};
MWF.xDesktop.requireApp("process.FormDesigner", "Module.$ElElement", null, false);
MWF.xApplication.process.FormDesigner.Module.Elicon = MWF.FCElicon = new Class({
	Extends: MWF.FC$ElElement,
	Implements: [Options, Events],
	options: {
		"style": "default",
		"propertyPath": "../x_component_process_FormDesigner/Module/Elicon/elicon.html"
	},

	_initModuleType: function(){
		this.className = "Elicon"
		this.moduleType = "element";
		this.moduleName = "elicon";
	},
	_createElementHtml: function(){
		var html = "<i class='"+(this.json.icon || "el-icon-platform-eleme")+"'";
		if (this.json.elProperties){
			Object.keys(this.json.elProperties).forEach(function(k){
				if (this.json.elProperties[k]) html += " "+k+"=\""+this.json.elProperties[k]+"\"";
			}, this);
		}

		var styles = {};
		if (this.json.iconSize) styles["font-size"] = this.json.iconSize+"px";
		if (this.json.iconColor) styles["color"] = this.json.iconColor;
		styles = Object.merge(styles, this.json.elStyles);

		if (styles){
			var style = "";
			Object.keys(styles).forEach(function(k){
				if (styles[k]) style += k+":"+styles[k]+";";
			}, this);
			html += " style=\""+style+"\"";
		}

		html += "></i>";
		return html;
	},
	_createMoveNode: function(){
		this.moveNode = new Element("div", {
			"MWFType": "label",
			"styles": this.css.moduleNodeMove,
			"events": {
				"selectstart": function(){
					return false;
				}
			}
		}).inject(this.form.container);
	},
	_createCopyNode: function(){
		this.copyNode = new Element("div", {
			"styles": this.css.moduleNodeShow
		});
		this.copyNode.addEvent("selectstart", function(){
			return false;
		});
	},
	_getCopyNode: function(){
		if (!this.copyNode) this._createCopyNode();
		this.copyNode.setStyle("display", "inline-block");
		return this.copyNode;
	},
	setPropertyName: function(){},
	setPropertyId: function(){}
});
