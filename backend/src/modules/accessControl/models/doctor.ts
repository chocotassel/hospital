import { Model, Table, Column, DataType, ForeignKey } from "sequelize-typescript";

@Table
export default class Doctor extends Model {
  id!: number;
  name!: string;
  // other properties...
}