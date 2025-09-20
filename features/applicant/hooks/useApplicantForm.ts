"use client";

import { useCallback } from "react";
import { useForm, type UseFormProps } from "react-hook-form";
import api from "@/shared/lib/axios";
import { normalizePhone } from "@/shared/util/normalize";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApplicantSchema } from "@/features/applicant/models/applicantSchema";

export type ApplicantFormValues = z.input<typeof ApplicantSchema>;

export function useApplicantForm(args?: {
  defaults?: Partial<ApplicantFormValues>;
  formOptions?: UseFormProps<ApplicantFormValues>;
}) {
  const baseDefaults: ApplicantFormValues = {
    name: "",
    phone: "",
    has_futures_experience: false,
    privacy_consent: false,
    marketing_consent: false,
  };

  const form = useForm<ApplicantFormValues>({
    resolver: zodResolver(ApplicantSchema),
    defaultValues: { ...baseDefaults, ...(args?.defaults || {}) },
    ...(args?.formOptions || {}),
  });

  const submit = useCallback(
    () =>
      form.handleSubmit(
        async values => {
          const formattedPhone =
            normalizePhone(values.phone) ?? values.phone.trim();

          const payload = {
            name: values.name.trim(),
            phone: formattedPhone,
            has_futures_experience: values.has_futures_experience === true,
          } as const;

          try {
            const { data } = await api.post("/api/applicant/create", payload);
            if (!data?.success) {
              toast.error(data?.message || "신청에 실패했습니다.");
              return;
            }
            toast.success("신청이 접수되었습니다.");
            form.reset(baseDefaults);
          } catch (error: any) {
            const message =
              error?.response?.data?.message || "네트워크 오류가 발생했습니다.";
            toast.error(message);
          }
        },
        errors => {
          const first = Object.values(errors)[0] as
            | { message?: unknown }
            | undefined;
          const msg =
            (typeof first?.message === "string" && first?.message) ||
            "입력값을 확인해주세요.";
          toast.error(msg);
        }
      ),
    [form]
  );

  return { form, submit };
}

export default useApplicantForm;
