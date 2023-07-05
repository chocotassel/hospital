import User from '../models/User';
import Role from '../models/Role';
import snowflake from '../common/utils/snowflake';
import { Op } from 'sequelize';
import Permission from '../models/Permission';

interface Condition {
  [key: string]: any; // 索引签名
}

class PermissionService {

  // 获取角色列表
  async getRoles() {
    return await Role.findAll();
    // return await Role.findAll({
    //   include: [
    //     {
    //       model: Permission,
    //     },
    //   ],
    // });
  }

  // 获取权限列表
  async getPermissions() {
    return await Role.findAll();
  }

  // 为用户分配角色
  async assignRole(userId: bigint, roleId: bigint) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('用户不存在');
    
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error('权限不存在');

    return await user.setRole(role);
  }
  
  // 修改用户的角色
  async changeRole(userId: bigint, newRoleId: bigint) {
    return this.assignRole(userId, newRoleId);
  }
}

export default new PermissionService();

