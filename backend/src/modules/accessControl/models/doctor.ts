import { Model, Table, Column, DataType, ForeignKey } from "sequelize-typescript";

@Table
export default class Doctor extends Model {
  doctor_id!: number;
  doctor_name!: string;
  gender!: string;
  date_of_birth!: Date;
  identity_card!: string;
  phone_number!: string;
  registration_fee!: number;
  description!: string;
  office_id!: number;
  photo!: Blob;
  employee_number!: string;
  // other properties...
}