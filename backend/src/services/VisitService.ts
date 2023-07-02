// VisitService.ts
import Visit from '../models/Visit';

class VisitService {
  // 获取所有出诊
  async getVisits() {
    return await Visit.findAll();
  }

  // 创建出诊
  async createVisit(data: any) {
    return await Visit.create(data);
  }

  // 更新出诊信息
  async updateVisit(id: string, data: any) {
    const visit = await Visit.findOne({ where: { id } });
    if (!visit) {
      throw new Error('出诊记录不存在');
    }

    return await visit.update(data);
  }

  // 删除出诊
  async deleteVisit(id: string) {
    const visit = await Visit.findOne({ where: { id } });
    if (!visit) {
      throw new Error('出诊记录不存在');
    }

    return await visit.destroy();
  }
}

export default VisitService;
