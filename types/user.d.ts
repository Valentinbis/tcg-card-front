export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roles?: string[];
  apiToken?: string;
}

export interface UserLoginInterface {
  email: string;
  password: string;
}
