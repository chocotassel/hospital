// OfficeController.ts
import { Context } from 'koa';
import OfficeService from '../services/OfficeService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';
import { can } from '../common/utils/rbac';
import Joi from 'joi';
import { paginate } from '../common/utils/paginate';

class OfficeController {

  // 获取所有诊室
  async getOffices(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewOffice')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    // 查询参数校验
    const { page = '1', limit = '10', name = '' } = ctx.query;

    const { _page, _limit, _name } = {
      _page: parseInt(<string>page, 10),
      _limit: parseInt(<string>limit, 10),
      _name: <string>name,
    } as { _page: number, _limit: number, _name: string };

    const schema = Joi.object({
      _name: Joi.string(),
    });

    const { error } = schema.validate({ _name });
    
    if (error) {
      return response.fail(ctx, '非法参数', error.details, 400);
    }

    // 业务逻辑
    try {
      const { offices, total } = await OfficeService.getOffices(_page, _limit, _name);
      return response.success(ctx, paginate(offices, _page, total, _limit));
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 获取单个诊室
  async getOffice(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewOffice')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const { id } = ctx.params;

    try {
      const office = await OfficeService.getOffice(id);
      return response.success(ctx, office);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 创建诊室
  async createOffice(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyOffice')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const rules: Rules = {
      office_name: {
        type: 'string',
        required: true,
      },
      office_description: {
        type: 'string',
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const office = await OfficeService.createOffice(data);
      return response.success(ctx, office);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 更新诊室信息
  async updateOffice(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyOffice')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const { id } = ctx.params;
    const rules: Rules = {
      office_name: {
        type: 'string',
        required: true,
      },
      office_description: {
        type: 'string',
      },
    };
    
    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const updatedOffice = await OfficeService.updateOffice(id, data);
      return response.success(ctx, updatedOffice);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 删除诊室
  async deleteOffice(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyOffice')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const { id } = ctx.params;

    try {
      const result = await OfficeService.deleteOffice(id);
      return response.success(ctx, result);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }
}

export default new OfficeController();
