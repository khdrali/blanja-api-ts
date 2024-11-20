export interface CreateType {
  username: string;
  email: string;
  password: string;
  phone: string;
  photo?: string;
}

export interface RequestOtpType {
  otp_code: string;
  email: string;
  created_at: Date;
}

export interface verifyOtpType{
  otp_code:string,
  email:string
}