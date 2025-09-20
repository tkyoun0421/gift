"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { ApplicantStatus } from "@/features/applicant/models/types";

interface SearchParams {
  page?: string;
  status?: string;
}

export async function getApplicantData(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || "1");
  const status = (searchParams.status || "all") as ApplicantStatus;
  const limit = 30;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  // Count (filtered)
  let countQuery = supabase
    .from("applicants")
    .select("id", { count: "exact", head: true });
  if (status === "pending") {
    countQuery = countQuery.or("is_completed.is.null,is_completed.eq.false");
  } else if (status === "completed") {
    countQuery = countQuery.eq("is_completed", true);
  }

  // Data (paged)
  let dataQuery = supabase.from("applicants").select("*");
  if (status === "pending") {
    dataQuery = dataQuery.or("is_completed.is.null,is_completed.eq.false");
  } else if (status === "completed") {
    dataQuery = dataQuery.eq("is_completed", true);
  }

  // Stats (optimized counts)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [
    { count: totalFiltered },
    { data: applicants },
    totalRes,
    completedRes,
    pendingRes,
    todayRes,
  ] = await Promise.all([
    countQuery,
    dataQuery
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false }),
    supabase.from("applicants").select("id", { count: "exact", head: true }),
    supabase
      .from("applicants")
      .select("id", { count: "exact", head: true })
      .eq("is_completed", true),
    supabase
      .from("applicants")
      .select("id", { count: "exact", head: true })
      .or("is_completed.is.null,is_completed.eq.false"),
    supabase
      .from("applicants")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayIso),
  ]);

  return {
    applicants: applicants || [],
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((totalFiltered || 0) / limit),
      totalCount: totalFiltered || 0,
      limit,
    },
    stats: {
      total: totalRes.count || 0,
      completed: completedRes.count || 0,
      pending: pendingRes.count || 0,
      today: todayRes.count || 0,
    },
  };
}
