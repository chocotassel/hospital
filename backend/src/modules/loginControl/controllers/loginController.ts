// loginController.ts
import { Context } from 'koa';
import { User } from '../../../models/User'
import bcrypt from 'bcrypt';
import auth from '../../../common/utils/auth';
import response from '../../../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../../../common/utils/validate';

class LoginController {
  // 用户登录
  async login(ctx: Context) {
    
    // 数据校验
    const rules: Rules = {
      username: {
        type: 'string',
        required: true,
      },
      password: {
        type: 'string',
        required: true,
      },
    };


    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, 'Invalid data', error, 400);
    }

    const { username, password } = data;
    try {
      // 数据库查询，查找用户
      const user = await User.findOne({ where: { username } });

      // 如果用户不存在，返回错误
      if (!user) {
        return response.fail(ctx, 'User does not exist', [], 404);
      }

      // 检查密码是否正确
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      
      if (!isPasswordValid) {
        return response.fail(ctx, 'Invalid password', [], 401);
      }

      // 创建一个会话（在这里，我们可以使用 JWT）
      const token = auth.signToken({ userId: user.id });
      
      // 发送响应
      return response.success(ctx, { token: token, message: 'Logged in successfully' });
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  async index(ctx: Context) {
    ctx.body = 'Hello World!';
  }
}

export default new LoginController();
