// VisitService.ts
import { Op } from 'sequelize';
import snowflake from '../common/utils/snowflake';
import Visit from '../models/Visit';
import Doctor from '../models/Doctor';

class VisitService {
  // 获取所有出诊
  async getVisits(page: number, limit: number, name?: string) {
    let whereCondition = {};
  
    if (name) {
      // 先根据传入的医生名字模糊查询医生表，得到所有符合条件的医生的 ID
      const doctors = await Doctor.findAll({
        where: {
          doctor_name: {
            [Op.like]: '%' + name + '%'
          }
        },
        attributes: ['doctor_id'] // 只需查询 doctor_id
      });
  
      // 把得到的医生 ID 提取出来
      const doctorIds = doctors.map(doctor => doctor.doctor_id);
  
      // 根据医生 ID 查询访问表
      whereCondition = {
        doctor_id: {
          [Op.in]: doctorIds
        }
      }
    }
  
    const visits = await Visit.findAll({
      where: whereCondition,
      limit,
      offset: (page - 1) * limit,
      include: [{
        model: Doctor,
      }]
    });
  
    const total = await Visit.count({
      where: whereCondition,
    });
  
    return { visits, total };
  }

  // 获取单个出诊
  async getVisit(id: string) {
    return await Visit.findOne({ 
      where: { 
        visit_id: BigInt(id).toString() 
      },
      include: [{
        model: Doctor,
      }]
    });
  }

  // 创建出诊
  async createVisit(data: any) {
    data.visit_id = BigInt(snowflake.visit.nextId()).toString();
    return await Visit.create(data);
  }

  // 更新出诊信息
  async updateVisit(id: string, data: any) {
    const visit = await Visit.findOne({ where: { visit_id: BigInt(id).toString() } });
    if (!visit) {
      throw new Error('出诊记录不存在');
    }

    return await visit.update(data);
  }

  // 删除出诊
  async deleteVisit(id: string) {
    const visit = await Visit.findOne({ where: { visit_id: BigInt(id).toString() } });
    if (!visit) {
      throw new Error('出诊记录不存在');
    }

    return await visit.destroy();
  }
}

export default new VisitService;
