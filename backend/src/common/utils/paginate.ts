// paginate.ts
import { Model } from "sequelize-typescript";

export function paginate<T extends Model[]>(data: T, currentPage: number = 1, total: number = 0, limit: number = 10) {
  return {
    data,
    pagination: {
      currentPage,
      total,
      totalPage: Math.ceil(total / limit),
      limit,
    },
  };
}