package com.x.query.core.express.statement;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.script.Bindings;
import javax.script.CompiledScript;
import javax.script.ScriptContext;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.Gson;
import com.x.base.core.project.Context;
import com.x.base.core.project.bean.tuple.Pair;
import com.x.base.core.project.gson.XGsonBuilder;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.script.AbstractResources;
import com.x.base.core.project.scripting.JsonScriptingExecutor;
import com.x.base.core.project.scripting.ScriptingFactory;
import com.x.base.core.project.webservices.WebservicesClient;
import com.x.organization.core.express.Organization;
import com.x.query.core.entity.schema.Statement;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.schema.Column;
import net.sf.jsqlparser.statement.select.PlainSelect;
import net.sf.jsqlparser.statement.select.Select;
import net.sf.jsqlparser.statement.select.SelectExpressionItem;
import net.sf.jsqlparser.statement.select.SelectItem;

public class ExecuteTargetBuilder {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExecuteTargetBuilder.class);

    private static final Gson gson = XGsonBuilder.instance();

    private static final String KEY_COUNT = "COUNT";
    private static final String KEY_LEFT_PARENTHESIS = "(";
    private static final String KEY_RIGHT_PARENTHESIS = ")";
    private static final String KEY_COUNTSQL = "COUNT(*)";

    private static final String[] AGGREGATE_FUNCTION_STARTS = new String[] { "AVG(", "COUNT(", "DISTINCT(", "MAX(",
            "MIN(", "SUM(" };

    private Context context;
    private EffectivePerson effectivePerson;
    private Organization organization;
    private Statement statement;
    private Runtime runtime;

    public ExecuteTargetBuilder(Context context, EffectivePerson effectivePerson, Organization organization,
            Statement statement, Runtime runtime) {
        this.context = context;
        this.effectivePerson = effectivePerson;
        this.organization = organization;
        this.statement = statement;
        this.runtime = runtime;
    }

    // 创建运行对象
    public Pair<ExecuteTarget, Optional<ExecuteTarget>> build() throws Exception {
        if (StringUtils.equalsAnyIgnoreCase(statement.getFormat(), Statement.FORMAT_SQL, Statement.FORMAT_SQLSCRIPT)) {
            return concreteExecuteTargetSql(context, effectivePerson, organization, statement, runtime);
        } else {
            return concreteExecuteTargetJpql(context, effectivePerson, organization, statement, runtime);
        }
    }

    // 创建 SQL 运行对象
    private Pair<ExecuteTarget, Optional<ExecuteTarget>> concreteExecuteTargetSql(Context context,
            EffectivePerson effectivePerson, Organization organization, Statement statement, Runtime runtime)
            throws Exception {
        ExecuteTarget data;
        Optional<ExecuteTarget> optionalCount = Optional.empty();
        String sql = "";
        if (StringUtils.equals(statement.getFormat(), Statement.FORMAT_SQL)) {
            sql = statement.getSql();
        } else {
            sql = script(context, effectivePerson, organization, runtime, statement.getSqlScriptText());
        }
        data = new ExecuteTarget(effectivePerson, organization, sql, runtime, null);
        if (data.getParsedStatement() instanceof net.sf.jsqlparser.statement.select.Select) {
            if (StringUtils.equalsIgnoreCase(statement.getCountMethod(), Statement.COUNTMETHOD_IGNORE)) {
                optionalCount = Optional.empty();
            } else if (StringUtils.equalsIgnoreCase(statement.getCountMethod(), Statement.COUNTMETHOD_AUTO)) {
                optionalCount = concreteExecuteTargetSqlCountAuto(effectivePerson, organization, runtime, sql,
                        data.getNamedParam());
            } else {
                optionalCount = Optional.of(concreteExecuteTargetSqlCountAssign(context, effectivePerson, organization,
                        statement, runtime, data.getNamedParam()));
            }
        }
        return Pair.of(data, optionalCount);
    }

    // 创建 JPQL 运行对象
    private Pair<ExecuteTarget, Optional<ExecuteTarget>> concreteExecuteTargetJpql(Context context,
            EffectivePerson effectivePerson, Organization organization, Statement statement, Runtime runtime)
            throws Exception {
        ExecuteTarget data;
        Optional<ExecuteTarget> optionalCount = Optional.empty();
        String jpql = "";
        if (StringUtils.equals(statement.getFormat(), Statement.FORMAT_JPQL)) {
            jpql = statement.getData();
        } else {
            jpql = script(context, effectivePerson, organization, runtime, statement.getScriptText());
        }
        data = new ExecuteTarget(effectivePerson, organization, jpql, runtime, null);
        if (data.getParsedStatement() instanceof net.sf.jsqlparser.statement.select.Select) {
            if (StringUtils.equalsIgnoreCase(statement.getCountMethod(), Statement.COUNTMETHOD_IGNORE)) {
                optionalCount = Optional.empty();
            } else if (StringUtils.equalsIgnoreCase(statement.getCountMethod(), Statement.COUNTMETHOD_AUTO)) {
                optionalCount = concreteExecuteTargetJpqlCountAuto(effectivePerson, organization, runtime, jpql,
                        data.getNamedParam());
            } else {
                optionalCount = Optional.of(concreteExecuteTargetJpqlCountAssign(context, effectivePerson, organization,
                        statement, runtime, data.getNamedParam()));
            }
        }
        return Pair.of(data, optionalCount);
    }

    // 创建 SQL COUNT ASSIGN
    private ExecuteTarget concreteExecuteTargetSqlCountAssign(Context context, EffectivePerson effectivePerson,
            Organization organization, Statement statement, Runtime runtime, Map<String, Object> prevNamedParam)
            throws Exception {
        String sql = "";
        if (StringUtils.equals(statement.getFormat(), Statement.FORMAT_SQL)) {
            sql = statement.getSqlCount();
        } else {
            sql = script(context, effectivePerson, organization, runtime, statement.getSqlCountScriptText());
        }
        return new ExecuteTarget(effectivePerson, organization, sql, runtime, prevNamedParam);
    }

    // 创建 SQL COUNT AUTO
    private Optional<ExecuteTarget> concreteExecuteTargetSqlCountAuto(EffectivePerson effectivePerson,
            Organization organization, Runtime runtime, String sql, Map<String, Object> prevNamedParam)
            throws Exception {
        Select select = (Select) CCJSqlParserUtil.parse(sql);
        PlainSelect plainSelect = (PlainSelect) select.getSelectBody();

        if (onlyAggregateFunction(plainSelect.getSelectItems())) {
            return Optional.empty();
        }
        plainSelect.getSelectItems().clear();
        plainSelect.getSelectItems().add(new SelectExpressionItem(new Column(KEY_COUNTSQL)));
        // 将在生成DATA语句中的参数对象PARAM传入避免重复计算
        return Optional
                .of(new ExecuteTarget(effectivePerson, organization, plainSelect.toString(), runtime, prevNamedParam));
    }

    private boolean onlyAggregateFunction(List<SelectItem> selectItems) {
        Optional<SelectItem> optional = selectItems.stream()
                .filter(o -> !StringUtils.startsWithAny(o.toString(), AGGREGATE_FUNCTION_STARTS)).findAny();
        return optional.isEmpty();
    }

    private ExecuteTarget concreteExecuteTargetJpqlCountAssign(Context context, EffectivePerson effectivePerson,
            Organization organization, Statement statement, Runtime runtime, Map<String, Object> prevNamedParam)
            throws Exception {
        String jpql = "";
        if (StringUtils.equals(statement.getFormat(), Statement.FORMAT_JPQL)) {
            jpql = statement.getCountData();
        } else {
            jpql = script(context, effectivePerson, organization, runtime, statement.getCountScriptText());
        }
        return new ExecuteTarget(effectivePerson, organization, jpql, runtime, prevNamedParam);
    }

    private Optional<ExecuteTarget> concreteExecuteTargetJpqlCountAuto(EffectivePerson effectivePerson,
            Organization organization, Runtime runtime, String jpql, Map<String, Object> prevNamedParam)
            throws Exception {
        Select select = (Select) CCJSqlParserUtil.parse(jpql);
        PlainSelect plainSelect = (PlainSelect) select.getSelectBody();
        if (onlyAggregateFunction(plainSelect.getSelectItems())) {
            return Optional.empty();
        }
        net.sf.jsqlparser.schema.Table table = (net.sf.jsqlparser.schema.Table) plainSelect.getFromItem();
        plainSelect.getSelectItems().clear();
        plainSelect.getSelectItems().add(new SelectExpressionItem(
                new Column(KEY_COUNT + KEY_LEFT_PARENTHESIS + table.getAlias().getName() + KEY_RIGHT_PARENTHESIS)));
        return Optional
                .of(new ExecuteTarget(effectivePerson, organization, plainSelect.toString(), runtime, prevNamedParam));
    }

    private String script(Context context, EffectivePerson effectivePerson, Organization organization, Runtime runtime,
            String scriptText) {
        String text = "";
        try {
            ScriptContext scriptContext = this.scriptContext(context, effectivePerson, organization, runtime);
            CompiledScript cs = ScriptingFactory.functionalizationCompile(scriptText);
            text = JsonScriptingExecutor.evalString(cs, scriptContext);
        } catch (Exception e) {
            LOGGER.error(e);
        }
        return text;
    }

    private ScriptContext scriptContext(Context context, EffectivePerson effectivePerson, Organization organization,
            Runtime runtime) throws Exception {
        ScriptContext scriptContext = ScriptingFactory.scriptContextEvalInitialServiceScript();
        Resources resources = new Resources();
        resources.setContext(context);
        resources.setApplications(context.applications());
        resources.setWebservicesClient(new WebservicesClient());
        resources.setOrganization(organization);
        Bindings bindings = scriptContext.getBindings(ScriptContext.ENGINE_SCOPE);
        bindings.put(ScriptingFactory.BINDING_NAME_SERVICE_RESOURCES, resources);
        bindings.put(ScriptingFactory.BINDING_NAME_SERVICE_EFFECTIVEPERSON, effectivePerson);
        bindings.put(ScriptingFactory.BINDING_NAME_SERVICE_PARAMETERS, gson.toJson(runtime.getParameter()));
        return scriptContext;
    }

    public static class Resources extends AbstractResources {

        private Organization organization;

        public Organization getOrganization() {
            return organization;
        }

        public void setOrganization(Organization organization) {
            this.organization = organization;
        }

    }

}
