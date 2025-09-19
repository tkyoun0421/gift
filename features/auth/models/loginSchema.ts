import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요."),
  password: z.string().min(1, "비밀번호를 입력하세요."),
});

export type LoginInsertType = z.infer<typeof LoginSchema>;
