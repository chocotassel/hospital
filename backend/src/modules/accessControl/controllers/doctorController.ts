// doctorController.ts
import { Context } from 'koa';

class DoctorController {
  // 获取所有科室  
  async getDepartments(ctx: Context) {
    // Logic for retrieving all departments
  }

  // 获取所有诊室
  async getOffices(ctx: Context) {
    // Logic for retrieving all offices
  }

  // 获取所有出诊记录
  async getVisits(ctx: Context) {
    // Logic for retrieving all visits
  }

  // 获取当前医生信息
  async getDoctorInfo(ctx: Context) {
    // Logic for retrieving the current doctor's info
  }

  // 更新当前医生信息
  async updateDoctorInfo(ctx: Context) {
    // Logic for updating the current doctor's info
  }
}

export default new DoctorController();
