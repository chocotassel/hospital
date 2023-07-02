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
      return response.fail(ctx, '服务器错误', [], 500);
    }
  }

  // 创建医生
  async createDoctor(ctx: Context) {
    const rules: Rules = {
      doctor_name: {
        type: 'string',
        required: true,
        min: 1,
        max: 255,
      },
      gender: {
        type: 'enum',
        required: true,
        enum: ['Male', 'Female'],
      },
      date_of_birth: {
        type: 'date',
        required: true,
      },
      identity_card: {
        type: 'string',
        required: true,
        len: 18,
      },
      phone_number: {
        type: 'string',
        required: true,
        len: 15,
      },
      registration_fee: {
        type: 'number',
        required: true,
        min: 0,
      },
      office_id: {
        type: 'number',
        required: true,
      },
      employee_number: {
        type: 'string',
        required: true,
        len: 15,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const doctor = await this.doctorService.createDoctor(data);
      return response.success(ctx, doctor);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, '服务器错误', [], 500);
    }
  }

  // 更新医生信息
  async updateDoctor(ctx: Context) {
    const { id } = ctx.params;
    const rules: Rules = {
      doctor_name: {
        type: 'string',
        required: true,
        min: 1,
        max: 255,
      },
      gender: {
        type: 'enum',
        required: true,
        enum: ['男', '女'],
      },
      date_of_birth: {
        type: 'date',
        required: true,
      },
      identity_card: {
        type: 'string',
        required: true,
        len: 18,
      },
      phone_number: {
        type: 'string',
        required: true,
        len: 15,
      },
      registration_fee: {
        type: 'number',
        required: true,
        min: 0,
      },
      description: {
        type: 'string',
        required: false,
      },
      office_id: {
        type: 'string',
        required: true,
        pattern: /^\d+$/,
      },
      // Note: file validation may need to be handled separately, e.g., in middleware
      photo: {
        type: 'string',
        required: false,
      },
      employee_number: {
        type: 'string',
        required: true,
        len: 15,
      },
    };
    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const updatedDoctor = await this.doctorService.updateDoctor(id, data);
      return response.success(ctx, updatedDoctor);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, '服务器错误', [], 500);
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
      return response.fail(ctx, '服务器错误', [], 500);
    }
  }
}

export default new DoctorController();
