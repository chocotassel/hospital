// 出诊记录
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, BelongsTo } from "sequelize-typescript";
import Doctor from "./Doctor";

@Table
export default class Visit extends Model {
  @PrimaryKey
  @Column(DataType.BIGINT)
  visit_id!: bigint;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  visit_date!: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  visit_hour!: number;

  @ForeignKey(() => Doctor)
  @Column(DataType.BIGINT)
  doctor_id!: bigint;

  @BelongsTo(() => Doctor)
  doctor!: Doctor;
}


