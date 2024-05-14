export interface Role {
  type: string;
  name: string;
  checked: boolean;
}

export interface Credentials {
  username: string;
  // Add any other properties related to credentials
}

export interface Operator {
  name: string;
  //credentials: Credentials; // Add the credentials property
  //contactInfo: { phone: string };
  companyId: string
  ///operatorName: string;
  username: string; // Add this line
  phone: string;
  roles: Role[];
  role1: Role | null;
  role2: Role | null;
  role3: Role | null;
}