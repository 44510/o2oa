package com.x.program.center.jaxrs.config;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;

import com.google.gson.JsonElement;
import com.x.base.core.project.annotation.FieldDescribe;
import com.x.base.core.project.config.Config;
import com.x.base.core.project.gson.GsonPropertyObject;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.tools.DefaultCharset;
import org.apache.commons.lang3.StringUtils;

public class ActionOpen extends BaseAction {
	private static Logger logger = LoggerFactory.getLogger(ActionOpen.class);

	ActionResult<Wo> execute(HttpServletRequest request, EffectivePerson effectivePerson,JsonElement jsonElement) throws Exception {
		ActionResult<Wo> result = new ActionResult<>();
		Wi wi = this.convertToWrapIn(jsonElement, Wi.class);
		Wo wo = new Wo();
		String fileName = wi.getFileName();
		if (StringUtils.isBlank(fileName)) {
			throw new ExceptionNameEmpty();
		}
		if(fileName.indexOf("/") > -1){
			throw new Exception("名称不能包含'/'!");
		}

		File file = new File(Config.base(),"config/"+fileName);
		wo.setSample(false);

		if(!file.exists()) {
		   file = new File(Config.base(),"configSample/"+fileName);
		   wo.setSample(true);
		}

		if(file.exists()) {
			if(file.isFile()) {
				String json = FileUtils.readFileToString(file, DefaultCharset.charset);
				wo.setFileContent(json);
			}
		}

		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		wo.setTime(df.format(new Date()));
		wo.setStatus("success");
		result.setData(wo);
		return result;
	}

	public static class Wi  extends GsonPropertyObject{

		@FieldDescribe("文件名")
		private String fileName;

		public String getFileName() {
			return fileName;
		}
		public void setFileName(String fileName) {
			this.fileName = fileName;
		}

	}

	public static class Wo extends GsonPropertyObject {

		@FieldDescribe("执行时间")
		private String time;

		@FieldDescribe("执行结果")
		private String status;

		@FieldDescribe("config文件内容")
		private String fileContent;

		@FieldDescribe("是否Sample")
		private boolean isSample;

		public String getTime() {
			return time;
		}

		public void setTime(String time) {
			this.time = time;
		}

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public String getFileContent() {
			return fileContent;
		}

		public void setFileContent(String fileContent) {
			this.fileContent = fileContent;
		}

		public boolean isSample() {
			return isSample;
		}

		public void setSample(boolean isSample) {
			this.isSample = isSample;
		}

	}

}
