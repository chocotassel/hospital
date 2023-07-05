// DepartmentService.ts
import { Op } from 'sequelize';
import snowflake from '../common/utils/snowflake';
import Department from '../models/Department';
import Office from '../models/Office';
import Doctor from '../models/Doctor';
import Visit from '../models/Visit';
import { sequelize } from '../db';

interface Condition {
  [key: string]: any; // 索引签名
}

class DepartmentService {
  // 获取所有科室
  async getDepartments(page?: number, limit?: number, name?: string) {
    let whereCondition: any = {};
  
    // 如果传入了name，添加模糊查询条件
    if (name) {
      whereCondition.department_name = { [Op.like]: '%' + name + '%' };
    }
  
    // 创建查询选项
    let findOptions: any = { where: whereCondition };
  
    // 如果传入了page和limit，添加offset条件
    if (page && limit) {
      findOptions.offset = (page - 1) * limit;
      findOptions.limit = limit;
    }
  
    const departments = await Department.findAll(findOptions);
  
    const total = await Department.count({ where: whereCondition });

    return { departments, total };
  }

  // 获取单个科室 id
  async getDepartmentById(id: string) {
    return await Department.findOne({ where: { department_id: BigInt(id).toString() } });
  }

  // // 获取单个科室 name
  // async getDepartmentByName(name: string) {
  //   return await Department.findOne({ where: { department_name: name } });
  // }

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
    // const department = await Department.findOne({ where: { department_id: BigInt(id).toString() } });
    // if (!department) {
    //   throw new Error('科室不存在');
    // }
    // return await department.destroy();
    // 开启事务
    const transaction = await sequelize.transaction();

    try {
      // 查询科室下的所有办公室
      const offices = await Office.findAll({
        where: { department_id: id },
        transaction
      });

      for (const office of offices) {
        // 查询办公室下的所有医生
        const doctors = await Doctor.findAll({
          where: { office_id: office.office_id },
          transaction
        });

        for (const doctor of doctors) {
          // 删除医生的所有就诊记录
          await Visit.destroy({
            where: { doctor_id: doctor.doctor_id },
            transaction
          });
        }

        // 删除办公室下的所有医生
        await Doctor.destroy({
          where: { office_id: office.office_id },
          transaction
        });
      }

      // 删除科室下的所有办公室
      await Office.destroy({
        where: { department_id: id },
        transaction
      });

      // 删除科室
      await Department.destroy({
        where: { department_id: id },
        transaction
      });

      // 提交事务
      await transaction.commit();
    } catch (err) {
      // 发生错误，回滚事务
      await transaction.rollback();
      throw err;
    }
  }
}

export default new DepartmentService();
