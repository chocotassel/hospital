import {describe, expect, test, it} from '@jest/globals';
import request from 'supertest';
import http from 'http';
import app from '../../src/index'; // Koa应用实例
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjc1Njc0ODg0MTk1MzU2NjcyIiwicm9sZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsidmlld0RlcGFydG1lbnQiLCJtb2RpZnlEZXBhcnRtZW50Iiwidmlld09mZmljZSIsIm1vZGlmeU9mZmljZSIsInZpZXdEb2N0b3IiLCJtb2RpZnlEb2N0b3IiLCJ2aWV3VmlzaXQiLCJtb2RpZnlWaXNpdCJdLCJpYXQiOjE2ODgzNDc0MzYsImV4cCI6MTY4ODM1MTAzNn0.oVLFoHshJh0Ri6gDuyhc06-9eGotPU6y8eA-GcyxOxk'
const departmentId = '1675443362779631616'

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
        department_name: 'Test Department',
        department_description: 'This is a test department'
      })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.department_name).toEqual('Test Department');
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
    expect(res.body.data.department_name).toEqual('Updated Test Department');
  });

  // 测试删除科室的接口
  it('should DELETE an existing department', async () => {
    const res = await request(server)
      .delete(`/departments/${departmentId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

});
