package com.x.query.service.processing;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import com.x.base.core.project.Context;
import com.x.base.core.project.cache.CacheManager;
import com.x.base.core.project.config.Config;
import com.x.base.core.project.config.Query;
import com.x.query.service.processing.schedule.CrawlCms;
import com.x.query.service.processing.schedule.CrawlWork;
import com.x.query.service.processing.schedule.CrawlWorkCompleted;
import com.x.query.service.processing.schedule.HighFreqDocument;
import com.x.query.service.processing.schedule.HighFreqWork;
import com.x.query.service.processing.schedule.HighFreqWorkCompleted;
import com.x.query.service.processing.schedule.LowFreqDocument;
import com.x.query.service.processing.schedule.LowFreqWork;
import com.x.query.service.processing.schedule.LowFreqWorkCompleted;
import com.x.query.service.processing.schedulelocal.HighFreqDocumentLocal;
import com.x.query.service.processing.schedulelocal.HighFreqWorkCompletedLocal;
import com.x.query.service.processing.schedulelocal.HighFreqWorkLocal;
import com.x.query.service.processing.schedulelocal.LowFreqDocumentLocal;
import com.x.query.service.processing.schedulelocal.LowFreqWorkCompletedLocal;
import com.x.query.service.processing.schedulelocal.LowFreqWorkLocal;

public class ThisApplication {

    private ThisApplication() {
        // nothing
    }

    public static final IndexWriteQueue indexWriteQueue = new IndexWriteQueue();

    private static ExecutorService threadPool;

    public static ExecutorService threadPool() {
        return threadPool;
    }

    private static void initThreadPool() {
        int maximumPoolSize = Runtime.getRuntime().availableProcessors() + 1;
        ThreadFactory threadFactory = new ThreadFactoryBuilder()
                .setNameFormat(ThisApplication.class.getPackageName() + "-threadpool-%d").build();
        threadPool = new ThreadPoolExecutor(0, maximumPoolSize, 120, TimeUnit.SECONDS, new ArrayBlockingQueue<>(1000),
                threadFactory);
    }

    protected static Context context;

    public static Context context() {
        return context;
    }

    protected static void setContext(Context context) {
        ThisApplication.context = context;
    }

    public static void init() {
        try {
            initThreadPool();
            context.startQueue(indexWriteQueue);
            CacheManager.init(context.clazz().getSimpleName());
            scheduleLowFrequencyDocument();
            scheduleLowFrequencyWork();
            scheduleLowFrequencyWorkCompleted();
            scheduleHighFrequencyDocument();
            scheduleHighFrequencyWorkCompleted();
            scheduleHighFrequencyWork();
            if (BooleanUtils.isTrue(Config.query().getCrawlWork().getEnable())) {
                context.schedule(CrawlWork.class, Config.query().getCrawlWork().getCron());
            }
            if (BooleanUtils.isTrue(Config.query().getCrawlWorkCompleted().getEnable())) {
                context.schedule(CrawlWorkCompleted.class, Config.query().getCrawlWorkCompleted().getCron());
            }
            if (BooleanUtils.isTrue(Config.query().getCrawlCms().getEnable())) {
                context.schedule(CrawlCms.class, Config.query().getCrawlCms().getCron());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void scheduleLowFrequencyDocument() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getLowFreqDocumentEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(LowFreqDocumentLocal.class,
                        Config.query().index().getLowFreqDocumentCron());
            } else {
                context.schedule(LowFreqDocument.class,
                        Config.query().index().getLowFreqDocumentCron());
            }
        }
    }

    private static void scheduleLowFrequencyWorkCompleted() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getLowFreqWorkCompletedEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(LowFreqWorkCompletedLocal.class,
                        Config.query().index().getLowFreqWorkCompletedCron());
            } else {
                context.schedule(LowFreqWorkCompleted.class,
                        Config.query().index().getLowFreqWorkCompletedCron());
            }
        }
    }

    private static void scheduleLowFrequencyWork() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getLowFreqWorkEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(LowFreqWorkLocal.class,
                        Config.query().index().getLowFreqWorkCompletedCron());
            } else {
                context.schedule(LowFreqWork.class,
                        Config.query().index().getLowFreqWorkCompletedCron());
            }
        }
    }

    private static void scheduleHighFrequencyDocument() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getHighFreqDocumentEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(HighFreqDocumentLocal.class,
                        Config.query().index().getHighFreqDocumentCron());
            } else {
                context.schedule(HighFreqDocument.class,
                        Config.query().index().getHighFreqDocumentCron());
            }
        }
    }

    private static void scheduleHighFrequencyWorkCompleted() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getHighFreqWorkCompletedEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(HighFreqWorkCompletedLocal.class,
                        Config.query().index().getHighFreqWorkCompletedCron());
            } else {
                context.schedule(HighFreqWorkCompleted.class,
                        Config.query().index().getHighFreqWorkCompletedCron());
            }
        }
    }

    private static void scheduleHighFrequencyWork() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getHighFreqWorkEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(HighFreqWorkLocal.class,
                        Config.query().index().getHighFreqWorkCron());
            } else {
                context.schedule(HighFreqWork.class,
                        Config.query().index().getHighFreqWorkCompletedCron());
            }
        }
    }

    public static void destroy() {
        try {
            CacheManager.shutdown();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
