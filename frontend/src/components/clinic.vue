<template>
  <!-- 书籍列表卡片 -->
  <el-card class="box-card">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="科室名" label-width="70px">
            <el-input clearable v-model="formInline.office_name" placeholder="请输入科室名"></el-input>
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
          label="诊室号"
          width="200">
        <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.office_id }}</span>
        </template>
        </el-table-column>

          <el-table-column
          label="诊室名称"
          width="300">
        <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.office_name }}</span>
        </template>
        </el-table-column>

        <el-table-column
          label="诊室描述"
          width="300">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.office_description }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="所属科室"
          width="300">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.department_name }}</span>
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
      <el-dialog title="诊室信息" :visible.sync="dialogFormVisible" >
        <el-form :model="form">
          <el-form-item label="诊室名称" :label-width="formLabelWidth">
            <el-input v-model="form.office_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="诊室描述" :label-width="formLabelWidth">
            <el-input v-model="form.office_description" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属科室" :label-width="formLabelWidth">
            <el-input v-model="form.department_name" autocomplete="off"></el-input>
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
        :total="office_id">
      </el-pagination>
      
    </el-card>
</template>

<script>
import axios from 'axios'
  export default {
    name: 'clinic',
    data() {
        return {
            formInline: {
              office_name: "",
            },
            value: "",
            //列表
            tableData: [{
                    "office_name": "",
                    "office_description": "",
                    "department_name": "",
                }],
            currentPage: 1,
            pageSize: 10,
            office_id: 0,
            status:0,
            
            //编辑 添加
            dialogFormVisible: false,
            form: {
            },
            formLabelWidth: '120px',
            index:'',
            editingMode: false
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
            url: `/api/books`,
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
          this.formInline.office_id = "";
          this.handleQueryAll()
      },
      //查询全部
      handleQueryAll() {
      const token = localStorage.getItem('token');
      const page = 1; // 页码
      const limit = 10; // 每页显示的数量
        
      axios.get('/api/offices', {
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
                    
            this.tableData.forEach(office => {
              office.department_name = office.department.department_name;
            });
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
      const officeName = this.formInline.office_name; // 搜索关键字
    
      axios.get('/api/offices', {
        params: {
          page,
          limit,
          name: officeName
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

    handleEdit(index, row){
      // 在这里可以访问到对应的科室号
      const officeId = row.office_id;
      this.editingofficeId = officeId;
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
        axios.put(`/api/offices/${this.editingofficeId}`, this.form, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
          .then(() => {
            this.handleQueryAll();
            this.dialogFormVisible = false; // 隐藏对话框
            this.form={}
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        // 添加确认
        axios.post('/api/offices', this.form, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
          .then(() => {
            this.handleQueryAll();
            this.dialogFormVisible = false; // 隐藏对话框
            this.form={}
          })
          .catch(error => {
            console.error(error);
          });
      }
    },

    // 删除按钮点击事件
    handleDelete(index, row) {
      const token = localStorage.getItem('token');
      axios.delete(`/api/offices/${row.office_id}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(() => {
          console.log("id:",row.office_id)
          this.tableData.splice(index, 1); // 从表格数据中移除被删除的项
        })
        .catch(error => {
          console.error(error);
        });
    },

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