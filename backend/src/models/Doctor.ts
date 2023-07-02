// 医生
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, BelongsTo, Unique, HasMany } from "sequelize-typescript";
import Office from "./Office";
import Visit from "./Visit";
import User from "./User";

@Table
export default class Doctor extends Model {
  @PrimaryKey
  @Column(DataType.BIGINT)
  doctor_id!: bigint;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  doctor_name!: string;

  @AllowNull(false)
  @Column(DataType.ENUM('男', '女'))
  gender!: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  date_of_birth!: Date;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(18))
  identity_card!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(15))
  phone_number!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10,2))
  registration_fee!: number;

  @Column(DataType.TEXT)
  description!: string;

  @ForeignKey(() => Office)
  @Column(DataType.BIGINT)
  office_id!: bigint;

  @BelongsTo(() => Office)
  office!: Office;

  @Column(DataType.BLOB)
  photo!: Buffer;

  @ForeignKey(() => User)
  @Column(DataType.STRING(15))
  employee_number!: string;

  @HasMany(() => Visit)
  visits!: Visit[];

  @BelongsTo(() => User, {foreignKey: 'employee_number'})
  user!: User;
}