// adminController.ts
import { Context } from 'koa';
import Department from '../models/Department';
import { can } from '../../../common/utils/rbac';
import validate from '../../../common/utils/validate';
import { success, fail } from '../../../common/utils/response';
import { paginate } from '../../../common/utils/paginate';
import { Rules } from 'async-validator';

class AdminController {
  // 获取所有科室  
  async getDepartments(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.role, 'viewDepartment')) {
      return fail(ctx, 'Permission denied', [], 403);
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
      return fail(ctx, 'Invalid data', error, 400);
    }

    const { page = 1, limit = 10 } = data;

    try {
      // 数据库查询
      const departments = await Department.findAll({
        limit,
        offset: (page - 1) * limit,
      });

      const total = await Department.count();

      // 发送响应
      return success(ctx, paginate(departments, page, total, limit));
    } catch (err) {
      console.error(err);
      return fail(ctx, 'Internal server error', [], 500);
    }
  }

  // 创建科室
  async createDepartment(ctx: Context) {
    // Logic for creating a new department
  }

  // 更新科室信息
  async updateDepartment(ctx: Context) {
    // Logic for updating a specific department
  }

  // 删除科室
  async deleteDepartment(ctx: Context) {
    // Logic for deleting a specific department
  }

}

export default new AdminController();