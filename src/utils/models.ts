export interface Role {
  type: string;
  name: string;
  checked: boolean;
}

export class Role {
  constructor(public name: string) {}
  
}

export interface Credentials {
  username: string;
  // Add any other properties related to credentials
}

export interface Operator {
  _id: string;
  name: string;
  credentials: { username: string }; // Add the credentials property
  contactInfo: { phone: string };
  companyId: string
  operatorName: string;
  operatorId: string;
  username: string; // Add this line
  password: string;
  phone: string;
  roles: Role[];
  role1: Role | null;
  role2: Role | null;
  role3: Role | null;
}