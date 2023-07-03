import User from '../models/User'
import bcrypt from 'bcrypt';
import auth from '../common/utils/auth';
import Role from '../models/Role';
import Permission from '../models/Permission';

class AuthenticationService {
  async loginUser(account: string, password: string) {
    // 查找用户
    const condition = account.length === 11 ? { phone_number: account } : { username: account };
    const user = await User.findOne({ 
      where: condition, 
      include: [{
        model: Role,
        include: [{
          model: Permission,
          through: {
            attributes: [],
          }
        }]
      }]
    });

    // 如果用户不存在，返回错误
    if (!user) {
      throw new Error('用户不存在');
    }

    // 检查密码是否正确
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 获取角色名和权限名
    const roleName = user.role.role_name;
    const permissions = user.role.permissions.map(permission => permission.permission_name);

    // 创建 token
    const token = auth.signToken({ userId: user.user_id, role: roleName, permissions: permissions });

    return { token: token, message: '登录成功' };
  }
}

export default new AuthenticationService();