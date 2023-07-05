<template>
  <!-- 书籍列表卡片 -->
  <el-card class="box-card">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="用户ID" label-width="70px">
            <el-input clearable v-model="formInline.user_id" placeholder="请输入用户ID"></el-input>
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
          label="密码"
          width="300">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.password }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="所属角色"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.role_name }}</span>
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
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属角色" :label-width="formLabelWidth">
            <el-input v-model="form.role_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="员工号" :label-width="formLabelWidth">
            <el-input v-model="form.employee_number" autocomplete="off"></el-input>
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
        :total="bookNumber">
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
              role_name: "",
            },
            value: "",
            //列表
            tableData: [{
                    "user_id": "",
                    "username": "",
                    "password": "",
                    "role_name": "",
                    "employee_number": "",
                }],
            currentPage: 1,
            pageSize: 10,
            bookNumber: 0,
            status:0,
            
            //编辑 添加
            dialogFormVisible: false,
            form: {
            },
            formLabelWidth: '120px',
            index:'',
        };
  },
  created() {
    this.handleQueryAll()
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
          this.formInline.role_name = "";
      },

      handleQuery() {
        const token = localStorage.getItem('token');

        axios.get('/api/users', {
          params: {
            department_name: this.formInline.department_name
          },
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
          .then(response => {
            this.tableData = response.data.data; 
          })
          .catch(error => {
            console.error(error);
          });
      },


      handleEdit(index, row){
      // 在这里可以访问到对应的科室号
      const departmentId = row.department_id;
      this.editingDepartmentId = departmentId;
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
        axios.put(`/api/departments/${this.editingDepartmentId}`, this.form, {
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
        axios.post('/api/departments', this.form, {
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
    handleQueryAll() {
      const token = localStorage.getItem('token');
      axios.get('/api/users', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log(response.data); 
        
          if (Array.isArray(response.data.data)) {
            this.tableData = response.data.data; 
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    // this.handleQueryAll();
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