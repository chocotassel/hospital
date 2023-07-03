// 科室
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, HasMany, Unique, AutoIncrement } from "sequelize-typescript";
import Office from "./Office";

@Table
class Department extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  department_id!: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  department_name!: string;

  @Column(DataType.TEXT)
  department_description!: string;

  @HasMany(() => Office)
  offices!: Office[];
}

export default Department;