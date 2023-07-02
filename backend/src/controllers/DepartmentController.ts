// DepartmentController.ts
import { Context } from 'koa';
import { can } from '../common/utils/rbac';
import validate from '../common/utils/validate';
import response from '../common/utils/response';
import { paginate } from '../common/utils/paginate';
import { Rules } from 'async-validator';
import DepartmentService from '../services/DepartmentService';

class DepartmentController {
  // 获取所有科室  
  async getDepartments(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewDepartment')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    // 数据校验
    const rules: Rules = {
      page: {
        type: 'number',
        required: false,
        min: 1,
      },
      limit: {
        type: 'number',
        required: false,
        min: 1,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    const { page = 1, limit = 10 } = data;

    try {
      // 使用服务获取数据
      const { departments, total } = await DepartmentService.getDepartments(page, limit);
      
      // 发送响应
      return response.success(ctx, paginate(departments, page, total, limit));
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }


  // 创建科室
  async createDepartment(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyDepartment')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    // 数据校验
    const rules: Rules = {
      department_name: {
        type: 'string',
        required: true,
      },
      department_description: {
        type: 'string',
        required: false,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      // 使用服务创建科室
      const department = await DepartmentService.createDepartment(data);
      // 发送响应
      return response.success(ctx, department);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }


  // 更新科室信息
  async updateDepartment(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyDepartment')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const { id } = ctx.params;

    // 数据校验
    const rules: Rules = {
      department_name: {
        type: 'string',
        required: true,
      },
      department_description: {
        type: 'string',
        required: false,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      // 使用服务更新科室
      await DepartmentService.updateDepartment(id, data);
      
      // 发送响应
      return response.success(ctx, { message: '科室更新成功' });
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }


  // 删除科室
  async deleteDepartment(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyDepartment')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }
    
    const { id } = ctx.params;

    try {
      // 使用服务删除科室
      await DepartmentService.deleteDepartment(id);
      
      // 发送响应
      return response.success(ctx, { message: '科室删除成功' });
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }
}

export default new DepartmentController();