"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  updateProfileAction,
  changePasswordAction,
  type UpdateProfileResult,
  type ChangePasswordResult,
} from "@/lib/auth/settings-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

interface Props {
  name: string;
  email: string;
}

export function SettingsForms({ name, email }: Props) {
  const [profileState, profileAction] = useActionState<
    UpdateProfileResult | null,
    FormData
  >(updateProfileAction, null);

  const [passwordState, passwordAction] = useActionState<
    ChangePasswordResult | null,
    FormData
  >(changePasswordAction, null);

  useEffect(() => {
    if (!profileState) return;
    if ("success" in profileState) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(profileState.error);
    }
  }, [profileState]);

  useEffect(() => {
    if (!passwordState) return;
    if ("success" in passwordState) {
      toast.success("Password changed successfully");
    } else {
      toast.error(
        passwordState.error === "wrong_password"
          ? "Current password is incorrect"
          : passwordState.error === "passwords_no_match"
            ? "Passwords do not match"
            : passwordState.error
      );
    }
  }, [passwordState]);

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription className="text-xs">
            Update your display name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={profileAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={name}
                maxLength={80}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                value={email}
                disabled
                className="bg-muted cursor-not-allowed"
                readOnly
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
            <SubmitButton label="Save Changes" />
          </form>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription className="text-xs">
            Choose a strong password at least 8 characters long
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={passwordAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
              />
            </div>
            <SubmitButton label="Change Password" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
