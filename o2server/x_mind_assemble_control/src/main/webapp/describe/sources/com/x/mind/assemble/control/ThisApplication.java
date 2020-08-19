package com.x.mind.assemble.control;

import com.x.base.core.project.Context;
import com.x.base.core.project.cache.CacheManager;
import com.x.base.core.project.config.Config;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.message.MessageConnector;
import com.x.mind.assemble.control.queue.QueueShareNotify;

public class ThisApplication {
	protected static Context context;
	public static QueueShareNotify queueShareNotify;

	public static Context context() {
		return context;
	}

	public static void init() {
		try {
			CacheManager.init(context.clazz().getSimpleName());
			LoggerFactory.setLevel(Config.logLevel().x_mind_assemble_control());
			queueShareNotify = new QueueShareNotify();
			MessageConnector.start(context());
			context().startQueue(queueShareNotify);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public static void destroy() {
		try {
			queueShareNotify.stop();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
