// OfficeService.ts
import { Op } from 'sequelize';
import snowflake from '../common/utils/snowflake';
import Office from '../models/Office';
import Department from '../models/Department';

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
