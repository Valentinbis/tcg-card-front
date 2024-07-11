export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roles?: string[];
}

export interface UserPayloadInterface {
  email: string;
  password: string;
}

// interface UserSession {
//   user: User;
//   token: string;
// }
