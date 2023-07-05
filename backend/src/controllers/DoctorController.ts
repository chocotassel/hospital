// doctorController.ts
import { Context } from 'koa';
import DoctorService from '../services/DoctorService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';
import { can } from '../common/utils/rbac';
import Joi from 'joi';
import { paginate } from '../common/utils/paginate';

class DoctorController {
  // 获取所有医生
  async getDoctors(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewDoctor')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    // 查询参数校验
    const { page = '1', limit = '10', name = '' } = ctx.query;

    const { _page, _limit, _name } = {
      _page: parseInt(<string>page, 10),
      _limit: parseInt(<string>limit, 10),
      _name: <string>name,
    } as { _page: number, _limit: number, _name: string };

    const schema = Joi.object({
      _name: Joi.string(),
    });

    const { error } = schema.validate({ _name });
    
    if (error) {
      return response.fail(ctx, '非法参数', error.details, 400);
    }

    // 业务逻辑
    try {
      const { doctors, total } = await DoctorService.getDoctors(_page, _limit, _name);
      return response.success(ctx, paginate(doctors, _page, total, _limit));
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }


  // 获取某个医生 id
  async getDoctorById(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewDoctor')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const { id } = ctx.params;

    try {
      const doctor = await DoctorService.getDoctorById(id);
      return response.success(ctx, doctor);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // // 获取医生 name
  // async getDoctor(ctx: Context) {
  //   // 权限检查
  //   if (!can(ctx.state.user.permissions, 'viewDoctor')) {
  //     return response.fail(ctx, '权限校验失败', [], 403);
  //   }

  //   const { name } = ctx.query;

  //   // 定义查询参数的验证规则
  //   const schema = Joi.object({
  //     name: Joi.string().required(),
  //   });

  //   // 对查询参数进行验证
  //   const { error } = schema.validate({ name });
    
  //   // 如果验证失败，返回错误信息
  //   if (error) {
  //     return response.fail(ctx, '非法参数', error.details, 400);
  //   }

  //   try {
  //     const doctor = await DoctorService.getDoctorByName(name as string);
  //     return response.success(ctx, doctor);
  //   } catch (err) {
  //     return response.fail(ctx, '服务器错误', err, 500);
  //   }
  // }


  // 创建医生
  async createDoctor(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyDoctor')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

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
        len: 11,
      },
      registration_fee: {
        type: 'number',
        required: true,
        min: 0,
      },
      office_id: {
        type: 'string',
        required: true,
        pattern: /^\d+$/,
      },
      employee_number: {
        type: 'string',
        required: true,
        len: 10,
      },
    };

    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const doctor = await DoctorService.createDoctor(data);
      return response.success(ctx, doctor);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 更新医生信息
  async updateDoctor(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyDoctor')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

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
        len: 11,
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
        len: 10,
      },
    };
    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    try {
      const updatedDoctor = await DoctorService.updateDoctor(id, data);
      return response.success(ctx, updatedDoctor);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  // 删除医生
  async deleteDoctor(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyDoctor')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const { id } = ctx.params;

    try {
      const result = await DoctorService.deleteDoctor(id);
      return response.success(ctx, result);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }
}

export default new DoctorController();