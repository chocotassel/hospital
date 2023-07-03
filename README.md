## 医院管理系统

### 1. 模块设计

1. 权限管理模块
   1. 管理员为新员工注册账号
   2. 管理员修改用户权限

2. 科室管理模块
   1. 增删改查

3. 诊室管理模块
   1. 增删改查

4. 医生管理模块
   1. 增删改查

5. 出诊管理模块
   1. 增删改查

6. 登录模块
   1. 登录



### 2. 数据库设计

- `departments`（科室）表：
  - `department_id`: BIGINT, AUTO_INCREMENT, PRIMARY KEY
  - `department_name`: VARCHAR(255), NOT NULL
  - `department_description`: TEXT
- `offices`（诊室）表：
  - `office_id`: BIGINT, AUTO_INCREMENT, PRIMARY KEY
  - `office_name`: VARCHAR(255), NOT NULL
  - `office_description`: TEXT
  - `department_id`: BIGINT, FOREIGN KEY REFERENCES `departments(department_id)`, NOT NULL
- `doctors`（医生）表：
  - `doctor_id`: BIGINT, PRIMARY KEY
  - `doctor_name`: VARCHAR(255), NOT NULL
  - `gender`: ENUM('Male', 'Female'), NOT NULL
  - `date_of_birth`: DATE, NOT NULL
  - `identity_card`: VARCHAR(18), NOT NULL
  - `phone_number`: VARCHAR(15), NOT NULL
  - `registration_fee`: DECIMAL(10,2), NOT NULL
  - `description`: TEXT
  - `office_id`: BIGINT, FOREIGN KEY REFERENCES `offices(office_id)`, NOT NULL
  - `photo`: BLOB
  - `employee_number`: VARCHAR(15), FOREIGN KEY REFERENCES users`(employee_number)`, NOT NULL, UNIQUE
- `visits`（出诊）表：
  - `visit_id`: BIGINT, AUTO_INCREMENT, PRIMARY KEY
  - `visit_date`: DATE, NOT NULL
  - `visit_hour`: INT, NOT NULL, CHECK (visit_hour BETWEEN 0 AND 23)
  - `doctor_id`: BIGINT, FOREIGN KEY REFERENCES `doctors(doctor_id)`, NOT NULL
- `roles`（角色）表：
  - `role_id`: BIGINT, AUTO_INCREMENT, PRIMARY KEY
  - `role_name`: VARCHAR(255), NOT NULL
- `users`（用户）表：
  - `user_id`: BIGINT, AUTO_INCREMENT, PRIMARY KEY
  - `username`: VARCHAR(255), NOT NULL
  - `password`: CHAR(64), NOT NULL
  - `role_id`: BIGINT, FOREIGN KEY REFERENCES `roles(role_id)`, NOT NULL
  - `employee_number`: VARCHAR(15), NOT NULL, UNIQUE
- `permissions`（权限）表：
  - `permission_id`: BIGINT, AUTO_INCREMENT, PRIMARY KEY
  - `permission_name`: VARCHAR(255), NOT NULL
- `role_permissions`（角色权限）表：
  - `role_id`: BIGINT, FOREIGN KEY REFERENCES `roles(role_id)`, NOT NULL
  - `permission_id`: BIGINT, FOREIGN KEY REFERENCES `permissions(permission_id)`, NOT NULL
  - PRIMARY KEY (`role_id`, `permission_id`)
