import { Context } from 'koa';
import UserService from '../services/UserService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';
import { can } from '../common/utils/rbac';
import Joi from 'joi';
import { paginate } from '../common/utils/paginate';
import PermissionService from '../services/PermissionService';

class UserController {
  // 获取所有用户
  async getUsers(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewUser')) {
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
      _name: Joi.string().allow(null, ''),
    });

    const { error } = schema.validate({ _name });
    
    if (error) {
      return response.fail(ctx, '非法参数', error.details, 400);
    }

    // 业务逻辑
    try {
      const {users, total} = await UserService.getUsers(_page, _limit, _name);
      return response.success(ctx, paginate(users, _page, total, _limit));
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 获取单个用户
  async getUser(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewUser')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const { id } = ctx.params;

    try {
      const user = await UserService.getUser(id);
      return response.success(ctx, user);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }
  
  // 创建用户
  async createUser(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyUser')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const rules: Rules = {
      username: {
        type: 'string',
        required: false,
      },
      password: {
        type: 'string',
        required: true,
      },
      phone_number: {
        type: 'string',
      },
      department_id: {
        type: 'string',
        required: true,
        pattern: /^\d+$/,
      },
      position: {
        type: 'string',
        required: true,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }
    
    try {
      const user = await UserService.createUser(data);
      
      if (data.role_id) {
        await PermissionService.assignRole(user.user_id, data.role_id);
      }

      return response.success(ctx, user);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 修改用户
  async updateUser(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyUser')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const rules: Rules = {
      user_id: {
        type: 'string',
        required: true,
        pattern: /^\d+$/,
      },
      username: {
        type: 'string',
        required: false,
      },
      password: {
        type: 'string',
        required: false,
      },
      employee_number: {
        type: 'string',
        required: false,
      },
      phone_number: {
        type: 'string',
        required: false,
      }
    };

    const { id } = ctx.params;

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      await UserService.updateUser(id, data);
      return response.success(ctx, '用户修改成功');
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }


  // 删除用户
  async deleteUser(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyUser')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const { id } = ctx.params;
    
    try {
      await UserService.deleteUser(id);
      return response.success(ctx, '用户删除成功');
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }
}

export default new UserController();
