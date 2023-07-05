// VisitController.ts
import { Context } from 'koa';
import VisitService from '../services/VisitService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';
import { can } from '../common/utils/rbac';
import Joi from 'joi';
import { paginate } from '../common/utils/paginate';

class VisitController {
  // 获取所有出诊
  async getVisits(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewVisit')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    // 查询参数校验
    const { page = '1', limit = '10', name = '' } = ctx.query;

    const { _page, _limit, _name } = {
      _page: parseInt(<string>page, 10),
      _limit: parseInt(<string>limit, 10),
      _name: <string>name,
    } as { _page: number, _limit: number, _name: string };


    // 业务逻辑
    try {
      const { visits, total } = await VisitService.getVisits(_page, _limit, _name);
      return response.success(ctx, paginate(visits, _page, total, _limit));
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 获取单个出诊
  async getVisit(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewVisit')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const { id } = ctx.params;

    try {
      const visit = await VisitService.getVisit(id);
      return response.success(ctx, visit);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 创建出诊
  async createVisit(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyVisit')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }
    
    const rules: Rules = {
      doctor_id: {
        type: 'string',
        required: true,
        pattern: /^\d+$/,
      },
      visit_hour: {
        type: 'number',
        required: true,
      },
      visit_date: {
        type: 'date',
        required: true,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const visit = await VisitService.createVisit(data);
      return response.success(ctx, visit);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 更新出诊信息
  async updateVisit(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyVisit')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }
    
    const { id } = ctx.params;
    const rules: Rules = {
      doctor_id: {
        type: 'string',
        required: true,
      },
      visit_hour: {
        type: 'number',
        required: true,
      },
      visit_date: {
        type: 'date',
        required: true,
      },
    };
    
    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const updatedVisit = await VisitService.updateVisit(id, data);
      return response.success(ctx, updatedVisit);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 删除出诊
  async deleteVisit(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyVisit')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }
    
    const { id } = ctx.params;

    try {
      const result = await VisitService.deleteVisit(id);
      return response.success(ctx, result);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }
}

export default new VisitController();
