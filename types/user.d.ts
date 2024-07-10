declare module "#auth-utils" {
  interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles?: string[];
  }

  interface UserSession {
    user: User;
    token: string;
  }
}

export {};
