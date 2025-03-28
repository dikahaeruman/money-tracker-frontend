import React, { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pie } from "@ant-design/charts";
import { Banknote, Plus, X } from "lucide-react";
import { Account } from "@/types/Account";
import { createAccount, deleteAccount, fetchAccounts,fetchCurrencies } from "@/utils/api";
import { useUser } from "@/contexts/UserContext";
import AccountList from "@/app/components/dashboard/AccountList";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  balance: z.coerce.number().min(0, "Balance must be positive"),
  currency: z.string().min(1, "Currency is required"),
});

const DashboardContent: React.FC = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", balance: undefined, currency: "" },
  });

  const { data: accounts,isLoading, error, refetch } = useQuery({
    queryKey: ["accounts", user?.id],
    queryFn: fetchAccounts,
    enabled: !!user,
  });

  const handleSubmit = async (values) => {
    try {
      await createAccount({
        account_name: values.name,
        balance: Number(values.balance), // Ensure it's a number
        currency_id: parseInt(values.currency, 10), // Ensure it's an integer
      });
      setIsOpen(false);
      form.reset();
      toast.success("Account created successfully");
      await queryClient.invalidateQueries(["accounts", values.id]);
    } catch (error) {
      toast.error("Failed to create account");
    }
  };

  const onDeleteAccount = useCallback(async (accountId) => {
    try {
      await deleteAccount(accountId);
      toast.success("Account deleted successfully");
      await refetch();
      await queryClient.invalidateQueries(["accounts", accountId]);
    } catch (error) {
      toast.error("Failed to delete account");
    }
  }, [refetch, queryClient]);

  const { data: currencies } = useQuery({ queryKey: ["currencies"], queryFn: fetchCurrencies });

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
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Account</AlertDialogTitle>
            </AlertDialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Emergency Fund" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Balance</FormLabel>
                      <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseFloat(value)); // Allows empty input
                        }}
                      />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies?.map(curr => (
                            <SelectItem key={curr.id} value={curr.id.toString()}>
                              {curr.code} - {curr.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 pt-4">
                  <AlertDialogCancel asChild>
                    <Button variant="outline" onClick={() => form.reset()}>
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Account
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountList accounts={accounts || []} onDeleteAccount={onDeleteAccount} />
        <Card>
          <CardHeader>
            <CardTitle>Account Balance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {accounts?.length ? <Pie data={accounts.map(({ account_name, balance }) => ({ name: account_name, value: balance }))} angleField="value" colorField="name" radius={0.75} label={false} legend={{ position: "bottom" }} /> : <div className="text-center py-12">No accounts ,to display</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
