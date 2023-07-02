import User from '../models/User'
import bcrypt from 'bcrypt';
import auth from '../common/utils/auth';

class AuthenticationService {
  async loginUser(account: string, password: string) {
    // 查找用户
    const condition = account.length === 11 ? { phone: account } : { username: account };
    const user = await User.findOne({ where: condition });

    // 如果用户不存在，返回错误
    if (!user) {
      throw new Error('用户不存在');
    }

    // 检查密码是否正确
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 创建一个会话（在这里，我们可以使用 JWT）
    const token = auth.signToken({ userId: user.user_id });

    return { token: token, message: '登录成功' };
  }
}

export default new AuthenticationService();