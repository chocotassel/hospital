import request from 'supertest';
import app from '../../src/index'; // 这是您的Koa应用实例

describe('Department Management API', () => {

  // 测试获取所有科室的接口
  it('should GET all departments', async () => {
    const res = await request(app)
      .get('/departments')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 测试创建科室的接口
  it('should POST a new department', async () => {
    const res = await request(app)
      .post('/departments')
      .send({
        department_name: 'Test Department',
        department_description: 'This is a test department'
      })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body.department_name).toEqual('Test Department');
  });

  // 测试更新科室的接口
  it('should PUT an existing department', async () => {
    const res = await request(app)
      .put(`/departments/${departmentId}`)
      .send({
        department_name: 'Updated Test Department',
        department_description: 'This is an updated test department'
      })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.department_name).toEqual('Updated Test Department');
  });

  // 测试删除科室的接口
  it('should DELETE an existing department', async () => {
    const res = await request(app)
      .delete(`/departments/${departmentId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(204);
  });

});
