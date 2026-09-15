import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface DepositRequest {
  id: string;
  resellerId: string;
  resellerDocId: string;
  resellerName: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  method: "Bank Transfer" | "USDT (TRC20)";
  bankInfo?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  usdtAddress?: string;
  proofImage: string;
  remark?: string;
  createdAt: string;
  memberOfAdminId?: string;
  referralId?: string;
  staffId?: string;
  adminId?: string;
}

export interface WithdrawalRequest {
  id: string;
  resellerId: string;
  resellerDocId: string;
  resellerName: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  method: "Bank Transfer" | "USDT (TRC20)";
  bankInfo?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  usdtAddress?: string;
  remark?: string;
  createdAt: string;
  memberOfAdminId?: string;
  referralId?: string;
  staffId?: string;
  adminId?: string;
}

export function useDepositRequests() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('public:deposit_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deposit_requests' }, () => {
        queryClient.invalidateQueries({ queryKey: ["deposit-requests"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["deposit-requests"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("deposit_requests")
          .select("*")
          .order("createdAt", { ascending: false });
        
        if (error) throw error;
        
        return (data || []).map(item => ({
          ...item,
          proofImage: item.screenshot || item.proofImage || "",
          createdAt: item.createdAt || item.created_at
        })) as DepositRequest[];
      } catch (error) {
        console.error("Error fetching deposit requests:", error);
        return [];
      }
    },
    staleTime: 30000,
  });
}

export function useWithdrawalRequests() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('public:withdrawal_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawal_requests' }, () => {
        queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["withdrawal-requests"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("withdrawal_requests")
          .select("*")
          .order("createdAt", { ascending: false });
        
        if (error) throw error;
        
        return (data || []).map(item => {
          let parsed: Record<string, unknown> | undefined;
          try {
            parsed = item.account_info ? JSON.parse(item.account_info) : undefined;
          } catch {
            parsed = undefined;
          }
          return {
            ...item,
            bankInfo: parsed,
            remark: (parsed?.rejectionRemark as string | undefined) ?? item.remark,
            createdAt: item.createdAt || item.created_at,
          };
        }) as WithdrawalRequest[];
      } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        return [];
      }
    },
    staleTime: 30000,
  });
}

export function useFinancialMutations() {
  const queryClient = useQueryClient();

  const updateDepositStatus = useMutation({
    mutationFn: async ({ id, status, remark }: { id: string; status: string; remark?: string }) => {
      const { error } = await supabase
        .from("deposit_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposit-requests"] });
      toast.success("Deposit status updated");
    }
  });

  const updateWithdrawalStatus = useMutation({
    mutationFn: async ({ id, status, remark }: { id: string; status: string; remark?: string }) => {
      const updates: Record<string, unknown> = { status };

      // The withdrawal_requests table has no dedicated remark column, so the
      // rejection reason is persisted inside the existing account_info JSON
      // blob. This keeps the admin -> reseller remark flow working without a
      // schema migration.
      if (remark !== undefined) {
        const { data: existing } = await supabase
          .from("withdrawal_requests")
          .select("account_info")
          .eq("id", id)
          .single();

        let info: Record<string, unknown> = {};
        if (existing?.account_info) {
          try {
            info = JSON.parse(existing.account_info) ?? {};
          } catch {
            info = {};
          }
        }
        info.rejectionRemark = remark.trim() || null;
        updates.account_info = JSON.stringify(info);
      }

      const { error } = await supabase
        .from("withdrawal_requests")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
      toast.success("Withdrawal status updated");
    }
  });

  return { updateDepositStatus, updateWithdrawalStatus };
}
