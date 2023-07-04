import User from '../models/User';
import Role from '../models/Role';
import snowflake from '../common/utils/snowflake';

class UserService {
  // 获取所有用户
  async getUsers() {
    return await User.findAll();
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

    await user.setRole(role);
  }

  // 修改用户的角色
  async changeRole(userId: bigint, newRoleId: bigint) {
    return this.assignRole(userId, newRoleId);
  }

  // 删除用户
  async deleteUser(userId: bigint) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('用户不存在');
    
    await user.destroy();
  }
}

export default new UserService();
