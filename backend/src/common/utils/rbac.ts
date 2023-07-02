// rbac.ts
const roles: { [role: string]: string[] } = {
    admin: ['viewDepartment', 'modifyDepartment', 'viewOffice', 'modifyOffice', 'viewDoctor', 'modifyDoctor', 'viewVisit', 'modifyVisit', 'viewUser', 'modifyUser', 'viewRole', 'modifyRole'],
    doctor: ['modifySelf', 'viewDepartment', 'viewOffice', 'viewVisit'],
};

// export function can(role: string, operation: string) {
//     return roles[role] && roles[role].includes(operation);
// }

export function can(userPermissions: string[], operation: string) {
    return userPermissions.includes(operation);
}