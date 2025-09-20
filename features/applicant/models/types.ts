export type ApplicantStatus = "all" | "pending" | "completed";

export interface Applicant {
  id: string;
  name?: string | null;
  email?: string | null;
  is_completed: boolean | null;
  created_at: string;
}

export interface ApplicantStats {
  today: number;
  pending: number;
  completed: number;
  total: number;
}

export interface ApplicantPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}
