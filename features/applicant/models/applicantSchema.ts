import { z } from "zod";

export const PHONE_REGEX = /^(010-\d{4}-\d{4}|010\d{8})$/;
export const NAME_REGEX = /^[가-힣a-zA-Z\s\u00B7·]{2,20}$/;

export const ApplicantSchema = z.object({
  name: z.string().trim().regex(NAME_REGEX, {
    message: "이름은 2~20자의 한글 또는 영문만 입력하세요.",
  }),
  phone: z.string().trim().regex(PHONE_REGEX, {
    message: "휴대폰 번호는 01012345678 또는 숫자 11자리여야 합니다.",
  }),
  has_futures_experience: z.coerce
    .boolean({
      message: "해외 선물 이용 경험을 선택하세요.",
    })
    .default(false),
  privacy_consent: z.coerce.boolean({
    message: "개인정보 동의가 필요합니다.",
  }),
  marketing_consent: z.coerce.boolean({
    message: "마케팅 정보 동의가 필요합니다.",
  }),
});

export type ApplicantSchemaType = z.infer<typeof ApplicantSchema>;

export const ApplicantInsertSchema = ApplicantSchema.pick({
  name: true,
  phone: true,
  has_futures_experience: true,
});
export type ApplicantInsertType = z.infer<typeof ApplicantInsertSchema>;
