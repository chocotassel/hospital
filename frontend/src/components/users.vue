<template>
  <!-- 书籍列表卡片 -->
  <el-card class="box-card">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="用户名" label-width="70px">
            <el-input clearable v-model="formInline.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 10px">
            <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          </el-form-item>
        </el-form>

        <!-- 表格内容显示区域   -->
        <el-table
          :data="tableData"
          style="width: 100%">

          <el-table-column
          label="用户ID"
          width="200">
        <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.user_id }}</span>
        </template>
        </el-table-column>

          <el-table-column
          label="用户名"
          width="200">
        <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.username }}</span>
        </template>
        </el-table-column>

        <el-table-column
          label="所属角色"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.role.role_name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="员工号"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.employee_number }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Form -->
      <el-dialog title="用户信息" :visible.sync="dialogFormVisible" >
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属角色" :label-width="formLabelWidth">
            <el-select v-model="form.role_name" placeholder="请选择角色">
              <el-option
                v-for="item in rolesData"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" :label-width="formLabelWidth">
            <el-select v-model="form.department_id" placeholder="请选择所属部门">
              <el-option
                v-for="item in departmentsData"
                :key="item.department_id"
                :label="item.department_name"
                :value="item.department_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位" :label-width="formLabelWidth">
            <el-select v-model="form.position" placeholder="请选择职位">
              <el-option
                v-for="item in positions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary"  @click="handleEditconfirm">确 定</el-button>
        </div>
      </el-dialog>
      <br>
      <!--   分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        :total="bookNum">
      </el-pagination>
      
    </el-card>
</template>

<script>
import axios from 'axios'
  export default {
    name: 'users',
    data() {
        return {
            formInline: {
              username: "",
            },
            value: "",
            //列表
            tableData: [{
                    "user_id": "",
                    "username": "",
                    "role_name": "",
                    "employee_number": "",
                }],
            currentPage: 1,
            pageSize: 10,
            status:0,
            bookNum:0,
            
            //编辑 添加
            dialogFormVisible: false,
            form: {
            },
            formLabelWidth: '120px',
            index:'',
            departmentsData: [],
            positions: [
              {
                value: '01',
                label: '医生'
              }, {
                value: '02',
                label: '护士'
              }, {
                value: '03',
                label: '技师'
              }, {
                value: '04',
                label: '行政人员'
              }, {
                value: '05',
                label: '清洁人员'
              }, {
                value: '06',
                label: '维修人员'
              }
            ],
            rolesData: [],
        };
  },
  created() {
    this.handleQueryAllRoles()
  },
  methods: {
      onSubmit() {
          console.log("submit!");
      },
      handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(page) {
          console.log(`当前页: ${page}`);
          axios({
            url: `/api/users`,
            method: 'get',
            params: {
              page: page,
              size: this.pageSize
            }
          }).then(res => {
            this.tableData = res.data
          })
      },

      handleReset() {
          this.formInline.username = "";
          this.handleQueryAll
      },

       //查询全部
       handleQueryAll() {
      const token = localStorage.getItem('token');
      const page = 1; // 页码
      const limit = 10; // 每页显示的数量
        
      axios.get('/api/users', {
        params: {
          page,
          limit
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log(response.data.data.data); // 输出响应数据，检查其格式是否符合预期
      
          if (Array.isArray(response.data.data.data)) {
            this.tableData = response.data.data.data; 
                    
            // this.tableData.forEach(doctor => {
            //   doctor.office_name = doctor.office.office_name;
            // });           
          }


        })
        .catch(error => {
          console.error(error);
        });
    },

    // 查询
    handleQuery() {
      const token = localStorage.getItem('token');
      const page = 1; // 页码
      const limit = 10; // 每页显示的数量
      const userName = this.formInline.username; // 搜索关键字
    
      axios.get('/api/users', {
        params: {
          page,
          limit,
          name: userName
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log("单个:", response.data.data.data); // 输出响应数据，检查其格式是否符合预期
        
          if (Array.isArray(response.data.data.data)) {
            this.tableData = response.data.data.data; 
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

      // 获取角色列表
      handleQueryAllRoles() {
        const token = localStorage.getItem('token');

        axios.get('/api/permission/roles', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
          .then(response => {
            this.rolesData = response.data.data;
          })
          .catch(error => {
            console.error(error);
          });
      },


      handleEdit(index, row){
      // 在这里可以访问到对应的科室号
      const userId = row.user_id;
      this.form = row;
      this.editingUserId = userId;
      this.dialogFormVisible = true;
      this.editingMode =true;

    }, 

    // 添加按钮点击事件
    handleAdd() {
      this.dialogFormVisible = true; // 显示对话框
      this.form = {}; // 将表单数据初始化为空对象
      this.editingMode = false;
    },

    // 确定按钮点击事件
    handleEditconfirm() {
      const token = localStorage.getItem('token');
    
      if (this.editingMode === true) {
        // 编辑确认
        axios.put(`/api/users/${this.editingUserId}`, this.form, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
          .then(() => {
            this.handleQueryAll();
            this.dialogFormVisible = false; // 隐藏对话框
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        // 添加确认
        axios.post('/api/users', this.form, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
          .then(() => {
            this.handleQueryAll();
            this.dialogFormVisible = false; // 隐藏对话框
          })
          .catch(error => {
            console.error(error);
          });
      }
    },

    handleQueryAllDepartments() {
      const token = localStorage.getItem('token');
      axios.get('/api/departments', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log(response.data.data.data); // 输出响应数据，检查其格式是否为数组
        
          if (Array.isArray(response.data.data.data)) {
            this.departmentsData = response.data.data.data; // 将响应数据中的data属性赋值给tableData
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.handleQueryAll();
    this.handleQueryAllDepartments();
  }
}
</script>

<style scoped>
.box-card {
  height: calc(100vh - 5px);
  position: relative;
}

.el-pagination {
  left: 50%;
  position: absolute;
  bottom: 3px;
  transform: translateX(-50%);
}
.el-dialog .el-input{
    width: 500px;
  }
</style>