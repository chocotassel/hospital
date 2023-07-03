// DepartmentService.ts
import snowflake from '../common/utils/snowflake';
import Department from '../models/Department';

class DepartmentService {
  async getDepartments(page: number, limit: number) {
    const departments = await Department.findAll({
      limit,
      offset: (page - 1) * limit,
    });
    const total = await Department.count();
    return { departments, total };
  }

  async createDepartment(data: any) {
    data.department_id = BigInt(snowflake.department.nextId()).toString();
    return await Department.create(data);
  }

  async updateDepartment(id: string, data: any) {
    const department = await Department.findOne({ where: { id: BigInt(id).toString() } });
    if (!department) {
      throw new Error('科室不存在');
    }
    return await department.update(data);
  }

  async deleteDepartment(id: string) {
    const department = await Department.findOne({ where: { id: BigInt(id).toString() } });
    if (!department) {
      throw new Error('科室不存在');
    }
    return await department.destroy();
  }
}

export default new DepartmentService();
