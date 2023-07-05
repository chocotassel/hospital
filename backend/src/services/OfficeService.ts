// OfficeService.ts
import { Op } from 'sequelize';
import snowflake from '../common/utils/snowflake';
import Office from '../models/Office';

class OfficeService {
  // 获取所有诊室
  async getOffices(page: number, limit: number, name?: string) {
    let whereCondition = {};
    
    // 如果传入了name，添加模糊查询条件
    if (name) {
      whereCondition = {
        office_name: {
          [Op.like]: '%' + name + '%'
        }
      }
    }

    const offices = await Office.findAll({
      where: whereCondition,
      limit,
      offset: (page - 1) * limit,
    });
    
    const total = await Office.count({
      where: whereCondition,
    });

    return { offices, total };
  }

  // 获取单个诊室
  async getOffice(id: string) {
    return await Office.findOne({ where: { office_id: BigInt(id).toString() } });
  }

  // 创建诊室
  async createOffice(data: any) {
    data.office_id = BigInt(snowflake.office.nextId()).toString();
    return await Office.create(data);
  }

  // 更新诊室信息
  async updateOffice(id: string, data: any) {
    const office = await Office.findOne({ where: { office_id: BigInt(id).toString() } });
    if (!office) {
      throw new Error('诊室不存在');
    }

    return await office.update(data);
  }

  // 删除诊室
  async deleteOffice(id: string) {
    const office = await Office.findOne({ where: { office_id: BigInt(id).toString() } });
    if (!office) {
      throw new Error('诊室不存在');
    }

    return await office.destroy();
  }
}

export default new OfficeService;
