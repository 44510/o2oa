package com.x.organization.assemble.authentication.jaxrs.mpweixin;

import com.x.base.core.project.annotation.JaxrsDescribe;
import com.x.base.core.project.annotation.JaxrsMethodDescribe;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.http.HttpMediaType;
import com.x.base.core.project.jaxrs.ResponseFactory;
import com.x.base.core.project.jaxrs.StandardJaxrsAction;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 * Created by fancyLou on 3/8/21.
 * Copyright © 2021 O2. All rights reserved.
 */
@Path("mpweixin")
@JaxrsDescribe("微信公众号单点登录")
public class MPweixinAction extends StandardJaxrsAction {

    private static Logger logger = LoggerFactory.getLogger(MPweixinAction.class);

    @JaxrsMethodDescribe(value = "微信公众号code登录.", action = ActionLoginWithCode.class)
    @GET
    @Path("login/code/{code}")
    @Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
    @Consumes(MediaType.APPLICATION_JSON)
    public void loginWithCode(@Suspended final AsyncResponse asyncResponse, @Context HttpServletRequest request,
                                @Context HttpServletResponse response, @PathParam("code") String code) {

        ActionResult<ActionLoginWithCode.Wo> result = new ActionResult<>();
        try {
            EffectivePerson effectivePerson = this.effectivePerson(request);
            result = new ActionLoginWithCode().execute(request, response, effectivePerson, code);
        }catch (Exception e) {
            logger.error(e);
            result.error(e);
        }
        asyncResponse.resume(ResponseFactory.getEntityTagActionResultResponse(request, result));
    }


    @JaxrsMethodDescribe(value = "绑定微信公众号openid到当前登录用户.", action = ActionBindWithCode.class)
    @GET
    @Path("bind/code/{code}")
    @Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
    @Consumes(MediaType.APPLICATION_JSON)
    public void bindWithCode(@Suspended final AsyncResponse asyncResponse, @Context HttpServletRequest request,
                              @Context HttpServletResponse response, @PathParam("code") String code) {

        ActionResult<ActionBindWithCode.Wo> result = new ActionResult<>();
        try {
            EffectivePerson effectivePerson = this.effectivePerson(request);
            result = new ActionBindWithCode().execute(effectivePerson, code);
        }catch (Exception e) {
            logger.error(e);
            result.error(e);
        }
        asyncResponse.resume(ResponseFactory.getEntityTagActionResultResponse(request, result));
    }

    @JaxrsMethodDescribe(value = "创建测试菜单", action = ActionCreateMenu.class)
    @GET
    @Path("menu/create")
    @Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
    @Consumes(MediaType.APPLICATION_JSON)
    public void createMenu(@Suspended final AsyncResponse asyncResponse, @Context HttpServletRequest request,
                           @Context HttpServletResponse response) {

        ActionResult<ActionCreateMenu.Wo> result = new ActionResult<>();
        try {
            result = new ActionCreateMenu().execute();
        }catch (Exception e) {
            logger.error(e);
            result.error(e);
        }
        asyncResponse.resume(ResponseFactory.getEntityTagActionResultResponse(request, result));
    }
}
