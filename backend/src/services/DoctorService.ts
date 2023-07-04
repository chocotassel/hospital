// DoctorService.ts
import snowflake from '../common/utils/snowflake';
import Department from '../models/Department';
import Doctor from '../models/Doctor';
import Office from '../models/Office';

class DoctorService {
  // 获取所有医生
  async getDoctors() {
    return await Doctor.findAll({
      include: [{
        model: Office,
        include: [{
          model: Department,
        }]
      }]
    });
  }

  // 获取单个医生
  async getDoctor(id: string) {
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
