// DoctorService.ts
import { Op } from 'sequelize';
import snowflake from '../common/utils/snowflake';
import Department from '../models/Department';
import Doctor from '../models/Doctor';
import Office from '../models/Office';
import path from 'path';
import { sequelize } from '../db';
import Visit from '../models/Visit';
import { generateEmployeeNumber } from '../common/utils/employeeNumber';
import User from '../models/User';

interface Condition {
  [key: string]: any; // 索引签名
}

class DoctorService {
  // 获取所有医生
  async getDoctors(page?: number, limit?: number, name?: string) {
    let whereCondition: any = {};
  
    // 如果传入了name，添加模糊查询条件
    if (name) {
      whereCondition.doctor_name = { [Op.like]: '%' + name + '%' };
    }
  
    // 创建查询选项
    let findOptions: any = { 
      where: whereCondition,
      include: [{
        model: Office,
        include: [{
          model: Department,
        }]
      }]
    };
  
    // 如果传入了page和limit，添加offset条件
    if (page && limit) {
      findOptions.offset = (page - 1) * limit;
      findOptions.limit = limit;
    }
  
    const doctors = await Doctor.findAll(findOptions);
  
    const total = await Doctor.count({ where: whereCondition });

    return { doctors, total };
  }

  // 获取单个医生 id
  async getDoctorById(id: string) {
    return await Doctor.findOne({ 
      where: { 
        doctor_id: BigInt(id).toString() 
      },
      include: [{
        model: Office,
        include: [{
          model: Department,
        }]
      }]
    });
  }

  // 获取单个医生 employee_number
  async getDoctorByEmployeeNumber(employeeNumber: string) {
    return await Doctor.findOne({
      where: {
        employee_number: employeeNumber
      },
      include: [{
        model: Office,
        include: [{
          model: Department,
        }]
      }]
    });
  }

  // // 获取医生 name
  // async getDoctorByName(name: string) {
  //   return await Doctor.findAll({
  //     where: {
  //       doctor_name: {
  //         [Op.like]: '%' + name + '%'
  //       }
  //     },
  //     include: [{
  //       model: Office,
  //       include: [{
  //         model: Department,
  //       }]
  //     }]
  //   });
  // }

  // 创建医生
  async createDoctor(data: any) {
    data.doctor_id = BigInt(snowflake.doctor.nextId()).toString();
    const total =  await User.count();
    const office = await Office.findOne({ where: { office_id: data.office_id }})

    if (!office) {
      throw new Error('诊室不存在');
    } 

    data.employee_number = generateEmployeeNumber(office.department_id, '01', total)
    
    const createDoctor = await Doctor.create(data);

    // 重新获取
    const doctorWithOffice = await Doctor.findOne({
      where: { doctor_id: BigInt(createDoctor.doctor_id).toString() },
      include: [{
        model: Office,
        attributes: ['office_name'],
        include: [{
          model: Department,
          attributes: ['department_name'],
        }]
      }]
    });

    return doctorWithOffice;
  }

  // 更新医生信息
  async updateDoctor(id: string, data: any) {
    const doctor = await Doctor.findOne({ where: { doctor_id: BigInt(id).toString() } });
    if (!doctor) {
      throw new Error('医生不存在');
    }

    const updateDoctor = await doctor.update(data);

    // 重新获取
    const doctorWithOffice = await Doctor.findOne({
      where: { doctor_id: BigInt(updateDoctor.doctor_id).toString() },
      include: [{
        model: Office,
        attributes: ['office_name'],
        include: [{
          model: Department,
          attributes: ['department_name'],
        }]
      }]
    });

    return doctorWithOffice;
  }

  // 更新医生头像
  async updateAvatar(id: string, path: string) {
    const doctor = await Doctor.findOne({ where: { doctor_id: BigInt(id).toString() } });
    if (!doctor) {
      throw new Error('医生不存在');
    }

    return await doctor.update({ avatar: path });
  }

  // 删除医生
  async deleteDoctor(id: string) {
    // const doctor = await Doctor.findOne({ where: { doctor_id: BigInt(id).toString() } });
    // if (!doctor) {
    //   throw new Error('医生不存在');
    // }

    // return await doctor.destroy();
    const transaction = await sequelize.transaction();

    try {
      // 删除医生的所有就诊记录
      await Visit.destroy({
        where: { doctor_id: id },
        transaction
      });

      // 删除医生
      await Doctor.destroy({
        where: { doctor_id: id },
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

export default new DoctorService
