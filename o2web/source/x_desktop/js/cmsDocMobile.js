layout.addReady(function () {
    //修改支持x-token
    (function(layout){
        // 是否ip
        var _isIp = function(ip) {
            var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            return reg.test(ip);
        };
        var uri = new URI(window.location.href);
        var options = uri.get("data");
        if (options["x-token"]) {
            // 删除
            Cookie.dispose("x-token");
            // 写入
            var host = window.location.host; // 域名 
            var domain = null;
            if (_isIp(host)) {
                domain = host;
            }else {
                if (host.indexOf(".") > 0) {
                    domain = host.substring(host.indexOf(".")); // 上级域名 如 .o2oa.net
                }
            }
            if (domain) {
                Cookie.write("x-token", options["x-token"], {domain: domain, path:"/"});
            }else {
                Cookie.write("x-token", options["x-token"]);
            }
        }
        var _load = function () {
            debugger;
            this.options = uri.get("data");
            if (!this.options.documentId) this.options.documentId = this.options.id;
            this.options.name = "cms.Document";
            // this.loadDocument(this.options);

            layout.openApplication(null, "cms.Document", this.options, null);
        };

        if (layout.session && layout.session.user){
            _load();
        }else{
            if (layout.sessionPromise){
                layout.sessionPromise.then(function(){
                    _load();
                },function(){});
            }
        }
    })(layout);
});
