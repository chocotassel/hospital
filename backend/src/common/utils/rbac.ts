const roles: { [role: string]: string[] } = {
    admin: ['viewDepartment', 'modifyDepartment', 'viewConsultationRoom', 'modifyConsultationRoom', 'viewDoctor', 'modifyDoctor', 'viewConsultation', 'modifyConsultation'],
    doctor: ['modifySelf', 'viewDepartment', 'viewConsultationRoom', 'viewConsultation'],
};
  
  
export function can(role: string, operation: string) {
    return roles[role] && roles[role].includes(operation);
}
