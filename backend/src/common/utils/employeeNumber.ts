import UserService from "../../services/UserService";

type PositionCode = '01' | '02' | '03' | '04' | '05' | '06';


export async function generateEmployeeNumber(department: number, position: PositionCode): Promise<string> {
  const departmentCode = department.toString().padStart(2, '0');
  
  const year = new Date().getFullYear().toString().slice(-2);

  let { total } = await UserService.getUsers();
  const count = (++total).toString().padStart(4, '0');

  return `${departmentCode}${position}${year}${count}`;
}

// 使用示例：
const newEmployeeNumber = generateEmployeeNumber(11, '04');
console.log(newEmployeeNumber);
