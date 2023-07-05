import { Context } from 'koa';
import PermissionService from '../services/PermissionService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';
import { can } from '../common/utils/rbac';
import Joi from 'joi';
import { paginate } from '../common/utils/paginate';

class PermissionController {
  // 获取所有角色
  async getRoles(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'assignRoleToUser')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    try {
      const roles = await PermissionService.getRoles();
      return response.success(ctx, roles);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  } 
  
  
  // 获取所有权限
  async getPermissions(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'assignRoleToUser')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    try {
      const permissions = await PermissionService.getPermissions();
      return response.success(ctx, permissions);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }
}

export default new PermissionController();