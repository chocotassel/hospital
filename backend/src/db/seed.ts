import Department from '../models/Department';
import Office from '../models/Office';
import Doctor from '../models/Doctor';
import Visit from '../models/Visit';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { Permission } from '../models/Permission';
import { RolePermission } from '../models/RolePermission';
import snowflake from '../common/utils/snowflake';
import bcrypt from 'bcrypt';


// 创建一些数据库数据
async function seedData() {
  console.log(snowflake.department.nextId().toString());
  
  try {
    // 创建一些部门
    const department1 = await Department.create({
      department_id: snowflake.department.nextId(),
      department_name: 'Department 1',
      department_description: 'Department 1 description',
    });

    const department2 = await Department.create({
      department_id: snowflake.department.nextId(),
      department_name: 'Department 2',
      department_description: 'Department 2 description',
    });

    // 创建一些办公室
    const office1 = await Office.create({
      office_id: snowflake.office.nextId(),
      office_name: 'Office 1',
      office_description: 'Office 1 description',
      department_id: department1.department_id,
    });

    const office2 = await Office.create({
      office_id: snowflake.office.nextId(),
      office_name: 'Office 2',
      office_description: 'Office 2 description',
      department_id: department2.department_id,
    });

    // 创建一些医生
    const doctor1 = await Doctor.create({
      doctor_id: snowflake.doctor.nextId(),
      doctor_name: 'Doctor 1',
      gender: 'Male',
      date_of_birth: new Date('1990-01-01'),
      identity_card: '1234567890',
      phone_number: '123456789',
      registration_fee: 100.0,
      description: 'Doctor 1 description',
      office_id: office1.office_id,
      photo: Buffer.from('doctor_photo'),
      employee_number: '0101230001',
    });

    const doctor2 = await Doctor.create({
      doctor_id: snowflake.doctor.nextId(),
      doctor_name: 'Doctor 2',
      gender: 'Female',
      date_of_birth: new Date('1995-01-01'),
      identity_card: '0987654321',
      phone_number: '987654321',
      registration_fee: 150.0,
      description: 'Doctor 2 description',
      office_id: office2.office_id,
      photo: Buffer.from('doctor_photo'),
      employee_number: '0101230002',
    });

    // 创建一些就诊记录
    const visit1 = await Visit.create({
      visit_id: snowflake.visit.nextId(),
      visit_date: new Date(),
      visit_hour: 10,
      doctor_id: doctor1.doctor_id,
    });

    const visit2 = await Visit.create({
      visit_id: snowflake.visit.nextId(),
      visit_date: new Date(),
      visit_hour: 14,
      doctor_id: doctor2.doctor_id,
    });

    // 创建一些角色
    const role1 = await Role.create({
      role_id: snowflake.role.nextId(),
      role_name: 'admin',
    });

    const role2 = await Role.create({
      role_id: snowflake.role.nextId(),
      role_name: 'doctor',
    });

    // 创建一些用户
    const user1 = await User.create({
      user_id: snowflake.user.nextId(),
      username: 'admin',
      phone_number: '12345678910',
      password: bcrypt.hashSync('password', 10),
      role_id: role1.role_id,
      employee_number: '1404230001',
    });

    const user2 = await User.create({
      user_id: snowflake.user.nextId(),
      username: 'doctor1',
      phone_number: '12345678911',
      password: bcrypt.hashSync('password', 10),
      role_id: role2.role_id,
      employee_number: '0101230001',
    });

    const user3 = await User.create({
      user_id: snowflake.user.nextId(),
      username: 'doctor2',
      phone_number: '12345678912',
      password: bcrypt.hashSync('password', 10),
      role_id: role2.role_id,
      employee_number: '0101230002',
    });

    const user4 = await User.create({
      user_id: snowflake.user.nextId(),
      username: 'nurse 1',
      phone_number: '12345678913',
      password: bcrypt.hashSync('password', 10),
      role_id: role2.role_id,
      employee_number: '0102230003',
    });

    // 创建一些权限
    const permission1 = await Permission.create({
      permission_id: snowflake.permission.nextId(),
      permission_name: 'viewDepartment',
    });

    const permission2 = await Permission.create({
      permission_id: snowflake.permission.nextId(),
      permission_name: 'modifyDepartment',
    });

    const permission3 = await Permission.create({
      permission_id: snowflake.permission.nextId(),
      permission_name: 'viewConsultationRoom',
    });

    const permission4 = await Permission.create({
      permission_id: snowflake.permission.nextId(),
      permission_name: 'modifyConsultationRoom',
    });

    const permission5 = await Permission.create({
      permission_id: snowflake.permission.nextId(),
      permission_name: 'viewDoctor',
    });

    const permission6 = await Permission.create({
      permission_id: snowflake.permission.nextId(),
      permission_name: 'modifyDoctor',
    });

    const permission7 = await Permission.create({
      permission_id: snowflake.permission.nextId(),
      permission_name: 'viewConsultation',
    });

    const permission8 = await Permission.create({
      permission_id: snowflake.permission.nextId(),
      permission_name: 'modifyConsultation',
    });

    // 关联角色和权限
    await RolePermission.create({
      role_id: role1.role_id,
      permission_id: permission1.permission_id,
    });

    await RolePermission.create({
      role_id: role1.role_id,
      permission_id: permission2.permission_id,
    });

    await RolePermission.create({
      role_id: role1.role_id,
      permission_id: permission3.permission_id,
    });

    await RolePermission.create({
      role_id: role1.role_id,
      permission_id: permission4.permission_id,
    });

    await RolePermission.create({
      role_id: role1.role_id,
      permission_id: permission5.permission_id,
    });

    await RolePermission.create({
      role_id: role1.role_id,
      permission_id: permission6.permission_id,
    });

    await RolePermission.create({
      role_id: role1.role_id,
      permission_id: permission7.permission_id,
    });

    await RolePermission.create({
      role_id: role1.role_id,
      permission_id: permission8.permission_id,
    });

    console.log('Data seeding completed!');
  } catch (error) {
    console.error('Error occurred while seeding data:', error);
  }
}

seedData();
