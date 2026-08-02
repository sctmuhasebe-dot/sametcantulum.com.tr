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