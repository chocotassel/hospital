// OfficeService.ts
import Office from '../models/Office';

class OfficeService {
  // 获取所有诊室
  async getOffices() {
    return await Office.findAll();
  }

  // 创建诊室
  async createOffice(data: any) {
    return await Office.create(data);
  }

  // 更新诊室信息
  async updateOffice(id: string, data: any) {
    const office = await Office.findOne({ where: { id } });
    if (!office) {
      throw new Error('Office not found');
    }

    return await office.update(data);
  }

  // 删除诊室
  async deleteOffice(id: string) {
    const office = await Office.findOne({ where: { id } });
    if (!office) {
      throw new Error('Office not found');
    }

    return await office.destroy();
  }
}

export default OfficeService;
