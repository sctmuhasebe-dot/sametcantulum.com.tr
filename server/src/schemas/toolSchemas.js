import { z } from 'zod';

// Gecikme Zammı Hesaplama Şeması
export const lateFeeSchema = z.object({
  amount: z.number({ invalid_type_error: "Tutar sayısal olmalıdır." })
    .positive("Asıl alacak tutarı 0'dan büyük olmalıdır."),
  
  dueDate: z.string().min(1, "Vade tarihi boş olamaz.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçersiz tarih formatı (YYYY-MM-DD olmalı)."),
  
  paymentDate: z.string().min(1, "Ödeme tarihi boş olamaz.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçersiz tarih formatı (YYYY-MM-DD olmalı)."),
  
  monthlyRate: z.number({ invalid_type_error: "Oran sayısal olmalıdır." })
    .positive("Oran 0'dan büyük olmalıdır.")
    .max(100, "Geçersiz oran değeri.")
    .optional() // Gönderilmezse varsayılan değer kullanılabilir
});

// Maaş / Bordro Hesaplama Şeması (Brütten Net / Netten Brüt)
export const payrollSchema = z.object({
  amount: z.number({ invalid_type_error: "Tutar sayısal olmalıdır." })
    .positive("Tutar 0'dan büyük olmalıdır."),
  
  type: z.enum(['brutToNet', 'netToBrut'], { 
    invalid_type_error: "Hesaplama türü 'brutToNet' veya 'netToBrut' olmalıdır." 
  }).default('brutToNet'),
  
  year: z.number({ invalid_type_error: "Yıl sayısal olmalıdır." })
    .int("Yıl tam sayı olmalıdır.")
    .min(2020, "Geçerli bir yıl giriniz.")
    .max(2030, "Geçerli bir yıl giriniz.")
    .default(2026),
});

// Kıdem ve İhbar Tazminatı Hesaplama Şeması
export const severanceSchema = z.object({
  startDate: z.string().min(1, "İşe giriş tarihi boş olamaz.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçersiz tarih formatı (YYYY-MM-DD olmalı)."),
  
  endDate: z.string().min(1, "İşten ayrılış tarihi boş olamaz.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçersiz tarih formatı (YYYY-MM-DD olmalı)."),
  
  grossSalary: z.number({ invalid_type_error: "Brüt ücret sayısal olmalıdır." })
    .positive("Brüt ücret 0'dan büyük olmalıdır."),
  
  additionalBenefits: z.number({ invalid_type_error: "Ek menfaatler sayısal olmalıdır." })
    .min(0, "Ek menfaatler 0'dan küçük olamaz.")
    .default(0),
  
  includeNotice: z.boolean({ invalid_type_error: "İhbar durumu boolean olmalıdır." })
    .default(true),
});