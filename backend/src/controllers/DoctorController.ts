// doctorController.ts
import { Context } from 'koa';
import DoctorService from '../services/DoctorService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';

class DoctorController {
  doctorService: DoctorService;

  constructor() {
    this.doctorService = new DoctorService();
  }

  // 获取所有医生
  async getDoctors(ctx: Context) {
    try {
      const doctors = await this.doctorService.getDoctors();
      return response.success(ctx, doctors);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  // 创建医生
  async createDoctor(ctx: Context) {
    const rules: Rules = {
      doctor_name: {
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
      const doctor = await this.doctorService.createDoctor(data);
      return response.success(ctx, doctor);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  // 更新医生信息
  async updateDoctor(ctx: Context) {
    const { id } = ctx.params;
    const rules: Rules = {
      doctor_name: {
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
      const updatedDoctor = await this.doctorService.updateDoctor(id, data);
      return response.success(ctx, updatedDoctor);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  // 删除医生
  async deleteDoctor(ctx: Context) {
    const { id } = ctx.params;

    try {
      const result = await this.doctorService.deleteDoctor(id);
      return response.success(ctx, result);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }
}

export default new DoctorController();
