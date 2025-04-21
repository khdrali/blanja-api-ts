export interface CreateType {
  username: string;
  email: string;
  password: string;
  phone: string;
  photo?: string | null;
}

export interface ChangeResetPasswordType {
  new_password: string;
  id: number;
}

export interface UpdateUserProfileType {
  id: number;
  username: string;
  phone: string;
  photo: string;
}
