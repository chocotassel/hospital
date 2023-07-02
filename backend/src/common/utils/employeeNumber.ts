type DepartmentCode = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15' | '16';
type PositionCode = '01' | '02' | '03' | '04' | '05' | '06';

let employeeCount: number = 0;

function generateEmployeeNumber(department: DepartmentCode, position: PositionCode): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const count = (++employeeCount).toString().padStart(4, '0');

  return `${department}${position}${year}${count}`;
}

// 使用示例：
const newEmployeeNumber = generateEmployeeNumber('11', '04');
console.log(newEmployeeNumber);
