import {describe, expect, test, it} from '@jest/globals';
import request from 'supertest';
import app from '../../src/index'; // Koa应用实例
const adminToken = process.env.ADMIN_TOKEN
const departmentId = '2'

const server = app.callback()

describe('Department Management API', () => {

  // 测试获取所有科室的接口
  it('should GET all departments', async () => {
    const res = await request(server)
      .get('/departments')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data.data)).toBe(true);
  });

  // 测试创建科室的接口
  it('should POST a new department', async () => {
    const res = await request(server)
      .post('/departments')
      .send({
        department_name: 'Test Department0',
        department_description: 'This is a test department0'
      })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  });

  // 测试更新科室的接口
  it('should PUT an existing department', async () => {
    const res = await request(server)
      .put(`/departments/${departmentId}`)
      .send({
        department_name: 'Updated Test Department',
        department_description: 'This is an updated test department'
      })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  });

  // 测试删除科室的接口
  it('should DELETE an existing department', async () => {
    const res = await request(server)
      .delete(`/departments/${departmentId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

});
