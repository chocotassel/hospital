import { User } from '../models/User'
import bcrypt from 'bcrypt';
import auth from '../common/utils/auth';

export default class AuthenticationService {
  async loginUser(username: string, password: string) {
    // 数据库查询，查找用户
    const user = await User.findOne({ where: { username } });

    // 如果用户不存在，返回错误
    if (!user) {
      throw new Error('User does not exist');
    }

    // 检查密码是否正确
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // 创建一个会话（在这里，我们可以使用 JWT）
    const token = auth.signToken({ userId: user.id });

    return { token: token, message: 'Logged in successfully' };
  }
}
