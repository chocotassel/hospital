// DepartmentService.ts
import snowflake from '../common/utils/snowflake';
import Department from '../models/Department';

class DepartmentService {
  // 获取所有科室
  async getDepartments(page: number, limit: number) {
    const departments = await Department.findAll({
      limit,
      offset: (page - 1) * limit,
    });
    const total = await Department.count();
    return { departments, total };
  }

  // 获取单个科室
  async getDepartment(id: string) {
    return await Department.findOne({ where: { department_id: BigInt(id).toString() } });
  }

  // 创建科室
  async createDepartment(data: any) {
    return await Department.create(data);
  }

  // 更新科室信息
  async updateDepartment(id: string, data: any) {
    const department = await Department.findOne({ where: { department_id: BigInt(id).toString() } });
    if (!department) {
      throw new Error('科室不存在');
    }
    return await department.update(data);
  }

  // 删除科室
  async deleteDepartment(id: string) {
    const department = await Department.findOne({ where: { department_id: BigInt(id).toString() } });
    if (!department) {
      throw new Error('科室不存在');
    }
    return await department.destroy();
  }
}

export default new DepartmentService();
