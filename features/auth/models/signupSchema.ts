import {
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/features/auth/constants/length";
import z from "zod";

export const SignUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력하세요.")
      .email("올바른 이메일 형식이 아닙니다."),
    name: z
      .string()
      .min(1, "이름을 입력하세요.")
      .max(NAME_MAX_LENGTH, `이름은 ${NAME_MAX_LENGTH}자 이하여야 합니다.`),
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력하세요."),
    inviteCode: z.string().min(1, "가입코드를 입력하세요."),
  })
  .refine(v => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type SignUpFormValues = z.infer<typeof SignUpSchema>;
