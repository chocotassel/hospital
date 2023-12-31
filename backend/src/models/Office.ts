// 诊室
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, BelongsTo, HasMany, Unique } from "sequelize-typescript";
import Department from "./Department";
import Doctor from "./Doctor";

@Table
export default class Office extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Unique
  @Column(DataType.BIGINT)
  office_id!: bigint;
  
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  office_name!: string;

  @Column(DataType.TEXT)
  office_description!: string;

  @ForeignKey(() => Department)
  @Column(DataType.INTEGER)
  department_id!: number;
  
  @BelongsTo(() => Department)
  department!: Department;

  @HasMany(() => Doctor)
  doctors!: Doctor[];
}