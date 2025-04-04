import React, { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pie } from "@ant-design/charts"; // Add Pie import from Ant Design Charts
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";
import { AddAccountModal } from "@/app/components/dashboard/modal/AddAccount";
import { fetchAccounts, fetchCurrencies, createAccount, deleteAccount } from "@/utils/api";
import { useUser } from "@/contexts/UserContext";
import AccountList from "@/app/components/dashboard/AccountList";

const formSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  balance: z.coerce.number().min(0, "Balance must be positive"),
  currency: z.string().min(1, "Currency is required"),
});

type FormValues = z.infer<typeof formSchema>;


const DashboardContent: React.FC = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", balance: undefined, currency: "" },
  });

  const { data: accounts, isLoading, error, refetch } = useQuery({
    queryKey: ["accounts", user?.id],
    queryFn: fetchAccounts,
    enabled: !!user,
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createAccount({
        account_name: values.name,
        balance: Number(values.balance), // Ensure it's a number
        currency_id: parseInt(values.currency, 10), // Ensure it's an integer
      });
      setIsOpen(false);
      toast.success("Account created successfully");
      await queryClient.invalidateQueries({
        queryKey: ["accounts"]
      });
    } catch (error) {
      toast.error("Failed to create account");
    }
  };

  const onDeleteAccount = useCallback(async (accountId: string) => {
    try {
      await deleteAccount(accountId);
      toast.success("Account deleted successfully");
      await refetch();
      await queryClient.invalidateQueries({
        queryKey: ["accounts"]
      });
    } catch (error) {
      toast.error("Failed to delete account");
    }
  }, [refetch, queryClient]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-destructive">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Accounts</h2>
        <AddAccountModal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountList 
          accounts={accounts || []} 
          onDeleteAccount={onDeleteAccount} // Pass onDeleteAccount directly
        />
        <Card>
          <CardHeader>
            <CardTitle>Account Balance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {accounts?.length ? (
              <Pie
                data={accounts.map(({ account_name, balance }) => ({
                  name: account_name,
                  value: balance,
                }))}
                angleField="value"
                colorField="name"
                radius={0.75}
                label={false}
                legend={{ position: "bottom" }}
              />
            ) : (
              <div className="text-center py-12">No accounts to display</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
