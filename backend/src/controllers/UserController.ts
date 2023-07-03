import { Context } from 'koa';
import userService from '../services/UserService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';
import { can } from '../common/utils/rbac';

class UserController {
  // 获取所有用户
  async getUsers(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewUser')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    try {
      const users = await userService.getUsers();
      return response.success(ctx, users);
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
      employee_number: {
        type: 'string',
        required: true,
      },
      phone_number: {
        type: 'string',
      }
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }
    
    try {
      const user = await userService.createUser(data);
      
      if (data.role_id) {
        await userService.assignRole(user.user_id, data.role_id);
      }

      return response.success(ctx, user);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 修改用户权限
  async changeRole(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyUser')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const rules: Rules = {
      user_id: {
        type: 'string',
        required: true,
      },
      role_id: {
        type: 'string',
        required: true,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }
    
    try {
      await userService.changeRole(data.user_id, data.role_id);
      return response.success(ctx, '权限修改成功');
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
      await userService.deleteUser(id);
      return response.success(ctx, '用户删除成功');
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }
}

export default new UserController();
