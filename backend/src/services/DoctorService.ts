// DoctorService.ts
import { Op } from 'sequelize';
import snowflake from '../common/utils/snowflake';
import Department from '../models/Department';
import Doctor from '../models/Doctor';
import Office from '../models/Office';

interface Condition {
  [key: string]: any; // 索引签名
}

class DoctorService {
  // 获取所有医生
  async getDoctors(page?: number, limit?: number, name?: string) {
    let condition: Condition = {};
    let whereCondition: Condition = {};
    
    // 如果传入了name，添加模糊查询条件
    if (name) {
      condition.user_name = { [Op.like]: '%' + name + '%' }
      whereCondition.user_name = { [Op.like]: '%' + name + '%' }
    }

    // 如果传入了page和limit，添加offset条件
    if (page && limit) {
      condition.offset = (page - 1) * limit;
      condition.limit = limit;
    }

    const doctors = await Department.findAll(condition);
    
    const total = await Department.count({
      where: whereCondition,
    });

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
    return await Doctor.create(data);
  }

  // 更新医生信息
  async updateDoctor(id: string, data: any) {
    const doctor = await Doctor.findOne({ where: { doctor_id: BigInt(id).toString() } });
    if (!doctor) {
      throw new Error('医生不存在');
    }

    return await doctor.update(data);
  }

  // 删除医生
  async deleteDoctor(id: string) {
    const doctor = await Doctor.findOne({ where: { doctor_id: BigInt(id).toString() } });
    if (!doctor) {
      throw new Error('医生不存在');
    }

    return await doctor.destroy();
  }
}

export default new DoctorService
