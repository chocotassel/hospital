// DepartmentService.ts
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

  async createDepartment(department: any) {
    return await Department.create(department);
  }

  async updateDepartment(id: number, department: any) {
    if (!(await Department.findByPk(id))) {
      throw new Error('科室不存在');
    }
    return await Department.update(department, { where: { id } });
  }

  async deleteDepartment(id: number) {
    if (!(await Department.findByPk(id))) {
      throw new Error('科室不存在');
    }
    return await Department.destroy({ where: { id } });
  }
}

export default new DepartmentService();
