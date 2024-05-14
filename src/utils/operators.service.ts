import { Operator } from './models';
import { CONSTANT } from '../constants/constants';


export const mapOperatorData = (operators: Operator[], companyId: string) =>
    operators
        .filter(operator => operator.companyId === companyId)
        .map(operator => ({
            operatorName: operator.name,
            credentials: { username: operator.username },
            contactInfo: { phone: operator.phone },
            roles: {
                'Role 1': operator.role1 || false,
                'Role 2': operator.role2 || false,
                'Role 3': operator.role3 || false,
            },
        }));

export const getOperatorRoles = (operator: Operator): string => {
    const operatorRoles: string[] = [];
    if (operator.role1) {
        operatorRoles.push(CONSTANT.ROLES[0]);
    }
    if (operator.role2) {
        operatorRoles.push(CONSTANT.ROLES[1]);
    }
    if (operator.role3) {
        operatorRoles.push(CONSTANT.ROLES[2]);
    }
    return operatorRoles.join(', ');
};