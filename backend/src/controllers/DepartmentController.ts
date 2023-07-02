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
    if (!can(ctx.state.user.role, 'viewDepartment')) {
      return response.fail(ctx, 'Permission denied', [], 403);
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
      return response.fail(ctx, 'Invalid data', error, 400);
    }

    const { page = 1, limit = 10 } = data;

    try {
      // 使用服务获取数据
      const { departments, total } = await DepartmentService.getDepartments(page, limit);
      
      // 发送响应
      return response.success(ctx, paginate(departments, page, total, limit));
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  // 创建科室
  async createDepartment(ctx: Context) {
    // 数据校验
    const rules: Rules = {
      // 定义科室创建的规则
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, 'Invalid data', error, 400);
    }

    try {
      // 使用服务创建科室
      const department = await DepartmentService.createDepartment(data);
      // 发送响应
      return response.success(ctx, department);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  // 更新科室信息
  async updateDepartment(ctx: Context) {
    // 数据校验
    const rules: Rules = {
      id: {
        type: 'number',
        required: true,
      },
      // 其他需要更新的字段...
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, 'Invalid data', error, 400);
    }

    try {
      // 使用服务更新科室
      await DepartmentService.updateDepartment(data.id, data);
      
      // 发送响应
      return response.success(ctx, { message: 'Department updated successfully' });
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  // 删除科室
  async deleteDepartment(ctx: Context) {
    // 数据校验
    const rules: Rules = {
      id: {
        type: 'number',
        required: true,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, 'Invalid data', error, 400);
    }

    try {
      // 使用服务删除科室
      await DepartmentService.deleteDepartment(data.id);
      
      // 发送响应
      return response.success(ctx, { message: 'Department deleted successfully' });
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }
}

export default new DepartmentController();