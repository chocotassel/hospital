// VisitController.ts
import { Context } from 'koa';
import VisitService from '../services/VisitService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';
import { can } from '../common/utils/rbac';

class VisitController {
  // 获取所有出诊
  async getVisits(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewVisit')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    try {
      const visits = await VisitService.getVisits();
      return response.success(ctx, visits);
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
      visit_id: {
        type: 'string',
        required: true,
        pattern: /^\d+$/,
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
