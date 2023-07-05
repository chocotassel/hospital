import User from '../models/User';
import Role from '../models/Role';
import snowflake from '../common/utils/snowflake';
import { Op } from 'sequelize';

class UserService {
  // 获取所有用户
  async getUsers(page: number, limit: number, name?: string) {
    let whereCondition = {};
    
    // 如果传入了name，添加模糊查询条件
    if (name) {
      whereCondition = {
        user_name: {
          [Op.like]: '%' + name + '%'
        }
      }
    }

    const users = await User.findAll({
      where: whereCondition,
      limit,
      offset: (page - 1) * limit,
    });
    
    const total = await User.count({
      where: whereCondition,
    });

    return { users, total };
  }

  // 查找单个用户
  async getUser(id: string) {
    return await User.findOne({ where: { user_id: BigInt(id).toString() } });
  }
  
  // 创建用户
  async createUser(data: any) {
    data.user_id = BigInt(snowflake.user.nextId()).toString();
    const user = await User.create(data);
    return user;
  }

  // 为用户分配角色
  async assignRole(userId: bigint, roleId: bigint) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('用户不存在');
    
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error('权限不存在');

    return await user.setRole(role);
  }

  // 修改用户信息
  async updateUser(userId: bigint, data: any) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('用户不存在');

    return await user.update(data);
  }
  
  // 修改用户的角色
  async changeRole(userId: bigint, newRoleId: bigint) {
    return this.assignRole(userId, newRoleId);
  }

  // 删除用户
  async deleteUser(userId: bigint) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('用户不存在');
    
    return await user.destroy();
  }
}

export default new UserService();