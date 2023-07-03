// OfficeController.ts
import { Context } from 'koa';
import OfficeService from '../services/OfficeService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';
import { can } from '../common/utils/rbac';

class OfficeController {

  // 获取所有诊室
  async getOffices(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewOffice')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    try {
      const offices = await OfficeService.getOffices();
      return response.success(ctx, offices);
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
      department_id: {
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
      department_id: {
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
