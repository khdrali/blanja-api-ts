export interface CreateType {
  username: string;
  email: string;
  password: string;
  phone: string;
  photo?: string;
}

export interface RequestOtpType {
  otp_code: string;
  unique_code: string;
  email: string;
  created_at: Date;
}
