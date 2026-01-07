export enum SignatureType {
  DRAWN = 'DRAWN', // chữ ký tay (ảnh/đường nét)
  DIGITAL = 'DIGITAL', // chữ ký số (RSA/ECDSA)
  FACE = 'FACE', // xác thực khuôn mặt
  VOICE = 'VOICE', // xác thực giọng nói
}
