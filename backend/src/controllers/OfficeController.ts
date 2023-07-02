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
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  // 创建诊室
  async createOffice(ctx: Context) {
    const rules: Rules = {
      office_name: {
        type: 'string',
        required: true,
      },
      // 其他字段规则...
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, 'Invalid data', error, 400);
    }

    try {
      const office = await this.officeService.createOffice(data);
      return response.success(ctx, office);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
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
      // 其他需要更新的字段...
    };
    
    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, 'Invalid data', error, 400);
    }

    try {
      const updatedOffice = await this.officeService.updateOffice(id, data);
      return response.success(ctx, updatedOffice);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  // 删除诊室
  async deleteOffice(ctx: Context) {
    const { id } = ctx.params;

    try {
      const result = await this.officeService.deleteOffice(id);
      return response.success(ctx, result);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }
}

export default new OfficeController();
