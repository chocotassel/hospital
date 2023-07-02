// 诊室
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, BelongsTo, HasMany } from "sequelize-typescript";
import Department from "./Department";
import Doctor from "./Doctor";

@Table
export default class Office extends Model {
  @PrimaryKey
  @Column(DataType.BIGINT)
  office_id!: bigint;
  
  @AllowNull(false)
  @Column
  office_name!: string;

  @Column(DataType.TEXT)
  office_description!: string;

  @ForeignKey(() => Department)
  @Column(DataType.BIGINT)
  department_id!: bigint;
  
  @BelongsTo(() => Department)
  department!: Department;

  @HasMany(() => Doctor)
  doctors!: Doctor[];
  // other properties...
}