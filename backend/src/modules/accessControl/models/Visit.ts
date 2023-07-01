import { Model, Table, Column, DataType, ForeignKey } from "sequelize-typescript";

@Table
export default class Visit extends Model {
  visit_id!: number;
  date!: Date;
  hour!: number;
  doctor_id!: number;
  // other properties...
}
