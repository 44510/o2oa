package com.x.processplatform.assemble.designer.jaxrs.designer;

import com.google.gson.JsonElement;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.entity.JpaObject;
import com.x.base.core.entity.enums.DesignerType;
import com.x.base.core.project.bean.WrapCopier;
import com.x.base.core.project.bean.WrapCopierFactory;
import com.x.base.core.project.exception.ExceptionAccessDenied;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.jaxrs.WiDesigner;
import com.x.base.core.project.jaxrs.WrapDesigner;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.tools.FieldTools;
import com.x.base.core.project.tools.ListTools;
import com.x.processplatform.assemble.designer.Business;
import com.x.processplatform.core.entity.element.Application;
import com.x.processplatform.core.entity.element.Form;
import com.x.processplatform.core.entity.element.Script;
import com.x.processplatform.core.entity.element.wrap.WrapProcess;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

class ActionSearch extends BaseAction {

	private static Logger logger = LoggerFactory.getLogger(ActionSearch.class);

	ActionResult<List<Wo>> execute(EffectivePerson effectivePerson, JsonElement jsonElement) throws Exception {
		if(!effectivePerson.isManager()){
			throw new ExceptionAccessDenied(effectivePerson);
		}
		Wi wi = this.convertToWrapIn(jsonElement, Wi.class);
		ActionResult<List<Wo>> result = new ActionResult<>();

		final List<Wo> resWos = new ArrayList<>();

		result.setData(resWos);
		result.setCount((long)resWos.size());
		return result;
	}

	private CompletableFuture<List<Wo>> searchScript(final Wi wi, final List<String> appIdList) {
		CompletableFuture<List<Wo>> cf = CompletableFuture.supplyAsync(() -> {
			List<Wo> resWos = new ArrayList<>();
			try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
				List<WoScript> woScripts;
				if (ListTools.isEmpty(appIdList)) {
					woScripts = emc.fetchAll(Script.class, WoScript.copier);
				} else {
					woScripts = emc.fetchIn(Script.class, WoScript.copier, Script.application_FIELDNAME, appIdList);
				}

				for (WoScript woScript : woScripts) {
					Map<String, String> map = FieldTools.fieldMatchKeyword(WoScript.class, woScript, wi.getKeyword(),
							wi.getCaseSensitive(), wi.getMatchWholeWord(), wi.getMatchRegExp());
					if (!map.isEmpty()) {
						Wo wo = new Wo();
						Application app = emc.find(woScript.getApplication(), Application.class);
						if (app != null) {
							wo.setAppId(app.getId());
							wo.setAppName(app.getName());
						}
						wo.setDesignerId(woScript.getId());
						wo.setDesignerName(woScript.getName());
						wo.setDesignerType(DesignerType.script.toString());
						wo.setPatternList(map);
						resWos.add(wo);
					}
				}
				woScripts.clear();
			}catch (Exception e){
				logger.error(e);
			}
			return resWos;
		});
		return cf;
	}

	private CompletableFuture<List<Wo>> searchForm(final Wi wi, final List<String> appIdList) {
		CompletableFuture<List<Wo>> cf = CompletableFuture.supplyAsync(() -> {
			List<Wo> resWos = new ArrayList<>();
			try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
				Business business = new Business(emc);
				List<String> formIds = business.form().listWithApplications(appIdList);
				for (List<String> partFormIds : ListTools.batch(formIds, 100)) {
					List<WoForm> woForms = emc.fetchIn(Form.class, WoForm.copier, Form.id_FIELDNAME, partFormIds);
					for (WoForm woForm : woForms) {
						Map<String, String> map = FieldTools.fieldMatchKeyword(WoForm.class, woForm, wi.getKeyword(),
								wi.getCaseSensitive(), wi.getMatchWholeWord(), wi.getMatchRegExp());
						if (!map.isEmpty()) {
							Wo wo = new Wo();
							Application app = emc.find(woForm.getApplication(), Application.class);
							if (app != null) {
								wo.setAppId(app.getId());
								wo.setAppName(app.getName());
							}
							wo.setDesignerId(woForm.getId());
							wo.setDesignerName(woForm.getName());
							wo.setDesignerType(DesignerType.script.toString());
							wo.setPatternList(map);
							resWos.add(wo);
						}
					}
					woForms.clear();
				}

			}catch (Exception e){
				logger.error(e);
			}
			return resWos;
		});
		return cf;
	}



	public static class Wi extends WiDesigner {

	}

	public static class Wo extends WrapDesigner{

	}

	public static class WoScript extends Script {

		static WrapCopier<Script, WoScript> copier = WrapCopierFactory.wo(Script.class, WoScript.class,
				JpaObject.singularAttributeField(Script.class, true, false),null);

	}

	public static class WoForm extends Form {

		static WrapCopier<Form, WoForm> copier = WrapCopierFactory.wo(Form.class, WoForm.class,
				JpaObject.singularAttributeField(Form.class, true, false),null);

	}

	public static class WoProcess extends WrapProcess {

		private static final long serialVersionUID = -8507786999314667403L;

	}

}
