// DoctorService.ts
import Doctor from '../models/Doctor';

class DoctorService {
  // 获取所有医生
  async getDoctors() {
    return await Doctor.findAll();
  }

  // 创建医生
  async createDoctor(data: any) {
    return await Doctor.create(data);
  }

  // 更新医生信息
  async updateDoctor(id: string, data: any) {
    const doctor = await Doctor.findOne({ where: { id: BigInt(id) } });
    if (!doctor) {
      throw new Error('医生不存在');
    }

    return await doctor.update(data);
  }

  // 删除医生
  async deleteDoctor(id: string) {
    const doctor = await Doctor.findOne({ where: { id: BigInt(id) } });
    if (!doctor) {
      throw new Error('医生不存在');
    }

    return await doctor.destroy();
  }
}

export default new DoctorService
