
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAdmin } from "@/hooks/useAdmin";
import { 
  Users, 
  ShoppingBag, 
  CheckCircle, 
  Clock,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_BASE_URL } from "@/config";

const Dashboard = () => {
  // const { stats, loading, refreshData } = useAdmin();
  const [data,setData]=useState(0)
const dataa=async()=>{
  try {
    const dtaaaa=await axios.get(`${API_BASE_URL}/api/sellers/count`)
    console.log(dtaaaa)
    setData(dtaaaa.data)
  } catch (error) {
    console.log(error)
  }
}
useEffect(()=>{
dataa()
},[])
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button 
          variant="outline" 
          size="sm" 
          // onClick={() => refreshData()} 
          // disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.sell}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.sell} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pend}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Waiting for sellers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.progress}</div>
            {/* {console.log(stats,"stats")} */}
            <p className="text-xs text-muted-foreground mt-1">
              Currently being delivered
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.complete}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-center py-8 text-muted-foreground">
              Order statistics will be displayed here
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seller Activity</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-center py-8 text-muted-foreground">
              Seller activity metrics will be displayed here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
