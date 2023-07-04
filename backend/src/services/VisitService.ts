// VisitService.ts
import snowflake from '../common/utils/snowflake';
import Visit from '../models/Visit';

class VisitService {
  // 获取所有出诊
  async getVisits() {
    return await Visit.findAll();
  }

  // 获取单个出诊
  async getVisit(id: string) {
    return await Visit.findOne({ where: { visit_id: BigInt(id).toString() } });
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
