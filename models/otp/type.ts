export interface RequestOtpType {
  otp_code: string;
  unique_code: string;
  email: string;
  created_at: Date;
}

export interface verifyOtpType {
  otp_code: string;
  unique_code: string;
  email: string;
}
