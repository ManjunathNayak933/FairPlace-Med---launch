import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile, updateProfile } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    shopName: "",
    gstNumber: "",
    shopLocation: { lat: 0, lng: 0, address: "" },
    paymentQrUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetchProfile().then((res) => {
      if (res.user) {
        setForm({
          name: res.user.name || "",
          email: res.user.email || "",
          shopName: res.user.shopName || "",
          gstNumber: res.user.gstNumber || "",
          shopLocation: res.user.shopLocation || {
            lat: 0,
            lng: 0,
            address: "",
          },
          paymentQrUrl: res.user.paymentQrUrl || "",
        });
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.user);
      toast({
        title: "Profile updated",
        description: "Your profile was updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                type="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Shop Name
              </label>
              <Input
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                GST Number
              </label>
              <Input
                name="gstNumber"
                value={form.gstNumber}
                onChange={handleChange}
              />
            </div>
            {/* Add more fields as needed */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
