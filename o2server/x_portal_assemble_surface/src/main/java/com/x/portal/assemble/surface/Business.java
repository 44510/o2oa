package com.x.portal.assemble.surface;

import com.x.base.core.container.EntityManagerContainer;
import com.x.organization.core.express.Organization;
import com.x.portal.assemble.surface.factory.*;
import com.x.portal.assemble.surface.factory.cms.CmsFactory;
import com.x.portal.assemble.surface.factory.process.ProcessFactory;
import com.x.portal.assemble.surface.factory.service.CenterServiceFactory;

public class Business {

	private EntityManagerContainer emc;

	public Business(EntityManagerContainer emc) throws Exception {
		this.emc = emc;
	}

	public EntityManagerContainer entityManagerContainer() {
		return this.emc;
	}

	private Organization organization;

	public Organization organization() throws Exception {
		if (null == this.organization) {
			this.organization = new Organization(ThisApplication.context());
		}
		return organization;
	}

	private PortalFactory portal;

	public PortalFactory portal() throws Exception {
		if (null == this.portal) {
			this.portal = new PortalFactory(this);
		}
		return portal;
	}

	private WidgetFactory widget;

	public WidgetFactory widget() throws Exception {
		if (null == this.widget) {
			this.widget = new WidgetFactory(this);
		}
		return widget;
	}

	private PageFactory page;

	public PageFactory page() throws Exception {
		if (null == this.page) {
			this.page = new PageFactory(this);
		}
		return page;
	}

	private ScriptFactory script;

	public ScriptFactory script() throws Exception {
		if (null == this.script) {
			this.script = new ScriptFactory(this);
		}
		return script;
	}

	private FileFactory file;

	public FileFactory file() throws Exception {
		if (null == this.file) {
			this.file = new FileFactory(this);
		}
		return file;
	}

	private CmsFactory cms;

	public CmsFactory cms() throws Exception {
		if (null == this.cms) {
			this.cms = new CmsFactory(this);
		}
		return cms;
	}

	private ProcessFactory process;

	public ProcessFactory process() throws Exception {
		if (null == this.process) {
			this.process = new ProcessFactory(this);
		}
		return process;
	}

	private ApplicationDictFactory applicationDict;

	public ApplicationDictFactory applicationDict() throws Exception {
		if (null == this.applicationDict) {
			this.applicationDict = new ApplicationDictFactory(this);
		}
		return applicationDict;
	}

	private ApplicationDictItemFactory applicationDictItem;

	public ApplicationDictItemFactory applicationDictItem() throws Exception {
		if (null == this.applicationDictItem) {
			this.applicationDictItem = new ApplicationDictItemFactory(this);
		}
		return applicationDictItem;
	}

	private CenterServiceFactory centerService;

	public CenterServiceFactory centerService() throws Exception {
		if (null == this.centerService) {
			this.centerService = new CenterServiceFactory(this);
		}
		return centerService;
	}

}
