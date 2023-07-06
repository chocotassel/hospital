import User from '../models/User';
import Role from '../models/Role';
import snowflake from '../common/utils/snowflake';
import { Op } from 'sequelize';
import { generateEmployeeNumber } from '../common/utils/employeeNumber';
import Permission from '../models/Permission';
import RolePermission from '../models/RolePermission';
import bcrypt from 'bcrypt';

interface Condition {
  [key: string]: any; // 索引签名
}

class UserService {
  // 获取所有用户
  async getUsers(page?: number, limit?: number, name?: string) {
    let whereCondition: any = {};
  
    // 如果传入了name，添加模糊查询条件
    if (name) {
      whereCondition.username = { [Op.like]: '%' + name + '%' };
    }
  
    // 创建查询选项
    let findOptions: any = { 
      where: whereCondition,
      include: [{
        model: Role
      }]
    };
  
    // 如果传入了page和limit，添加offset条件
    if (page && limit) {
      findOptions.offset = (page - 1) * limit;
      findOptions.limit = limit;
    }
  
    const users = await User.findAll(findOptions);
  
    const total = await User.count({ where: whereCondition });

    return { users, total };
  }

  // 查找单个用户
  async getUser(id: string) {
    return await User.findOne({ where: { user_id: BigInt(id).toString() } });
  }
  
  // 创建用户
  async createUser(data: any) {
    data.user_id = BigInt(snowflake.user.nextId()).toString();
    const total = await User.count();
    data.employee_number = generateEmployeeNumber(data.department_id, data.position, total);
    data.password = bcrypt.hashSync(data.password, 10)
    const user = await User.create(data);

    return user;
  }

  // 修改用户信息
  async updateUser(userId: bigint, data: any) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('用户不存在');

    return await user.update(data);
  }

  // 删除用户
  async deleteUser(userId: bigint) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('用户不存在');
    
    return await user.destroy();
  }
}

export default new UserService();

