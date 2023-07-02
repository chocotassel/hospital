// OfficeController.ts
import { Context } from 'koa';
import OfficeService from '../services/OfficeService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';

class OfficeController {
  officeService: OfficeService;

  constructor() {
    this.officeService = new OfficeService();
  }

  // 获取所有诊室
  async getOffices(ctx: Context) {
    try {
      const offices = await this.officeService.getOffices();
      return response.success(ctx, offices);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 创建诊室
  async createOffice(ctx: Context) {
    const rules: Rules = {
      office_name: {
        type: 'string',
        required: true,
      },
      office_description: {
        type: 'string',
      },
      department_id: {
        type: 'string',
        required: true,
        pattern: /^\d+$/,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const office = await this.officeService.createOffice(data);
      return response.success(ctx, office);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 更新诊室信息
  async updateOffice(ctx: Context) {
    const { id } = ctx.params;
    const rules: Rules = {
      office_name: {
        type: 'string',
        required: true,
      },
      office_description: {
        type: 'string',
      },
      department_id: {
        type: 'string',
        required: true,
        pattern: /^\d+$/,
      },
    };
    
    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const updatedOffice = await this.officeService.updateOffice(id, data);
      return response.success(ctx, updatedOffice);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 删除诊室
  async deleteOffice(ctx: Context) {
    const { id } = ctx.params;

    try {
      const result = await this.officeService.deleteOffice(id);
      return response.success(ctx, result);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }
}

export default new OfficeController();
