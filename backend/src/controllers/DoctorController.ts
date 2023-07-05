// doctorController.ts
import { Context } from 'koa';
import DoctorService from '../services/DoctorService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';
import { can } from '../common/utils/rbac';
import Joi from 'joi';
import { paginate } from '../common/utils/paginate';
import path from 'path';
import fs from 'fs';

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
      _name: Joi.string().allow(null, ''),
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

  // 获取某个医生 employee_number
  async getDoctorByEmployeeNumber(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'viewDoctor')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }

    const employee_number = ctx.query.employee_number as string;

    try {
      const doctor = await DoctorService.getDoctorByEmployeeNumber(employee_number);
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

  // 头像上传
  async updateAvatar(ctx: Context) {
    // 权限检查
    if (!can(ctx.state.user.permissions, 'modifyDoctor')) {
      return response.fail(ctx, '权限校验失败', [], 403);
    }
    
    // 检查是否有文件上传
    if (!ctx.request.files || !ctx.request.files.file) {
      ctx.status = 400;
      return ctx.body = '未上传文件';
    }

    const file = ctx.request.files.file as any;
  
    if (Array.isArray(file)) {
      ctx.status = 400;
      return ctx.body = '不允许上传多个文件';
    }

    const { id } = ctx.params;
    const reader = fs.createReadStream(file.filepath);
    
    // 在文件名中包含用户的 ID，以便将头像文件和用户关联起来
    let filePath = path.join(__dirname,'..', '..', 'public/uploads/') + `/${id}_${file.newFilename}`;
    const upStream = fs.createWriteStream(filePath);
    reader.pipe(upStream);
    console.log('上传成功', filePath);
      
    
    try {
      // 更新用户信息，保存头像的路径
      const relativeFilePath = 'uploads/' + `${id}_${file.newFilename}`;
      const result = await DoctorService.updateAvatar(id, relativeFilePath);
    
      return response.success(ctx, result);
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
