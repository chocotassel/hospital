import {describe, expect, test, it} from '@jest/globals';
import request from 'supertest';
import app from '../../src/index'; // Koa应用实例
const adminToken = process.env.ADMIN_TOKEN
let userId = '1675674885319430144'
let roleId = '1675674884183429120'

const server = app.callback()

describe('User Management API', () => {

  // 测试获取所有用户的接口
  it('should GET all users', async () => {
    const res = await request(server)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  }
  );

  // 测试获取单个用户的接口
  it('should GET an existing user', async () => {
    const res = await request(server)
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  }
  );

  // 测试创建用户的接口
  it('should POST a new user', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        username: 'Test User0',
        password: '123456',
        employee_number: '0000000000',
        phone_number: '11111111111',  
      })
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('create user',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
    userId = res.body.data.user_id;
  }
  );

  // 测试更新用户的接口
  it('should PUT an existing user', async () => {
    const res = await request(server)
      .put(`/users/${userId}`)
      .send({
        username: 'Test User0',
        password: '123456',
        employee_number: '0000000000',
        phone_number: '11111111111',
      })
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('update user',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  }
  );

  // 测试删除用户的接口
  it('should DELETE an existing user', async () => {
    const res = await request(server)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('delete user',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  }
  );

});
