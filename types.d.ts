import * as express from "express";

// Perluas tipe Request dari Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number; // Atur sesuai dengan payload token Anda
        email?: string; // Tambahkan properti lain jika diperlukan
        [key: string]: any; // Untuk fleksibilitas tambahan
      };
    }
  }
}
