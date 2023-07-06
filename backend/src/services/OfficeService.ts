// OfficeService.ts
import { Op } from 'sequelize';
import snowflake from '../common/utils/snowflake';
import Office from '../models/Office';
import Department from '../models/Department';
import { sequelize } from '../db';
import Doctor from '../models/Doctor';
import Visit from '../models/Visit';

interface Condition {
  [key: string]: any; // 索引签名
}

class OfficeService {
  // 获取所有诊室
  async getOffices(page?: number, limit?: number, name?: string) {
    let whereCondition: any = {};
  
    // 如果传入了name，添加模糊查询条件
    if (name) {
      whereCondition.office_name = { [Op.like]: '%' + name + '%' };
    }
  
    // 创建查询选项
    let findOptions: any = { 
      where: whereCondition,
      include: [{
        model: Department,
      }]
    };
  
    // 如果传入了page和limit，添加offset条件
    if (page && limit) {
      findOptions.offset = (page - 1) * limit;
      findOptions.limit = limit;
    }
  
    const offices = await Office.findAll(findOptions);
  
    const total = await Office.count({ where: whereCondition });

    return { offices, total };
  }

  // 获取单个诊室
  async getOffice(id: string) {
    return await Office.findOne({ 
      where: { 
        office_id: BigInt(id).toString() 
      },
      include: [{
        model: Department,
      }]
    });
  }

  // 创建诊室
  async createOffice(data: any) {
    data.office_id = BigInt(snowflake.office.nextId()).toString();
    const createOffice = await Office.create(data);

    // 重新获取
    const officeWithDepartment = await Office.findOne({
      where: { office_id: BigInt(createOffice.office_id).toString() },
      include: [{
        model: Department,
        attributes: ['department_name'],
      }]
    });

    return officeWithDepartment;
  }

  // 更新诊室信息
  async updateOffice(id: string, data: any) {
    const office = await Office.findOne({ where: { office_id: BigInt(id).toString() } });
    if (!office) {
      throw new Error('诊室不存在');
    }

    // return await office.update(data);

    const updatedOffice = await office.update(data);
    
    // 重新获取
    const officeWithDepartment = await Office.findOne({
      where: { office_id: BigInt(updatedOffice.office_id).toString() },
      include: [{
        model: Department,
        attributes: ['department_name'],
      }]
    });

    return officeWithDepartment;
  }

  // 删除诊室
  async deleteOffice(id: string) {
    // const office = await Office.findOne({ where: { office_id: BigInt(id).toString() } });
    // if (!office) {
    //   throw new Error('诊室不存在');
    // }

    // return await office.destroy();
    const transaction = await sequelize.transaction();
    
    try {
      // 查询办公室下的所有医生
      const doctors = await Doctor.findAll({
        where: { office_id: id },
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
        where: { office_id: id },
        transaction
      });

      // 删除办公室
      await Office.destroy({
        where: { office_id: id },
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

export default new OfficeService;
