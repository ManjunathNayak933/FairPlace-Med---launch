import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Check,
  FileText,
  DollarSign,
  Package,
  MapPin,
} from "lucide-react";
import { checkBackendHealth } from "../lib/utils";

const Dashboard = () => {
  const { user } = useAuth();
  const { todayOrders, pendingOrders, getTodayEarnings, getTotalEarnings } =
    useOrders();

  const todayEarnings = getTodayEarnings();
  const totalEarnings = getTotalEarnings();

  const [health, setHealth] = useState<string>("Checking...");

  useEffect(() => {
    checkBackendHealth().then((res) => setHealth(res.status));
  }, []);

  const StatCard = ({
    title,
    value,
    icon,
    description,
    trend = 0,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    trend?: number;
  }) => (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="p-2 rounded-full bg-med-light-blue">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {trend > 0 ? (
              <ArrowUp className="h-3 w-3 text-med-green mr-1" />
            ) : trend < 0 ? (
              <ArrowDown className="h-3 w-3 text-med-red mr-1" />
            ) : null}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const PendingOrderCard = () => (
    <Card className="col-span-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">Pending Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No pending orders right now</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-med-light-blue/30 rounded-lg"
              >
                <div>
                  <p className="font-medium">{order.buyerName}</p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} items · ₹{order.total}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-med-red hover:text-med-red/90"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="bg-med-green hover:bg-med-green/90"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))}
            {pendingOrders.length > 3 && (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/orders">View All {pendingOrders.length} Orders</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/products/add">Add Product</Link>
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Backend status: {health}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Daily Orders"
          value={todayOrders.length}
          icon={<FileText className="h-4 w-4 text-med-blue" />}
          description="Today's total orders"
        />
        <StatCard
          title="Today's Earnings"
          value={`₹${todayEarnings}`}
          icon={<DollarSign className="h-4 w-4 text-med-blue" />}
          description="Total earnings today"
          trend={1} // Positive trend
        />
        <StatCard
          title="Total Earnings"
          value={`₹${totalEarnings}`}
          icon={<DollarSign className="h-4 w-4 text-med-blue" />}
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders.length}
          icon={<Check className="h-4 w-4 text-med-blue" />}
          description={
            pendingOrders.length > 0
              ? "Requires your attention"
              : "All caught up!"
          }
          trend={pendingOrders.length > 0 ? -1 : 0}
        />
      </div>

      <PendingOrderCard />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shop Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shop Name</span>
                <span className="font-medium">{user?.shopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST Number</span>
                <span className="font-medium">{user?.gstNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-20 flex flex-col" asChild>
                <Link to="/products">
                  <Package className="h-5 w-5 mb-1" />
                  <span>Manage Products</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" asChild>
                <Link to="/orders">
                  <FileText className="h-5 w-5 mb-1" />
                  <span>View All Orders</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" asChild>
                <Link to="/profile">
                  <MapPin className="h-5 w-5 mb-1" />
                  <span>Update Shop Details</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" asChild>
                <Link to="/earnings">
                  <DollarSign className="h-5 w-5 mb-1" />
                  <span>Financial Reports</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
