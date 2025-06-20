
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/contexts/OrderContext';
import { CalendarIcon, Download, ArrowUpRight, DollarSign, TrendingUp } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Earnings = () => {
  const { orders, getTotalEarnings, getTodayEarnings } = useOrders();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Generate sample data for chart
  const getDaysInMonth = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  const generateChartData = () => {
    const daysInMonth = getDaysInMonth();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const data = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date > currentDate) break;
      
      // Filter orders for this day
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getDate() === day && 
               orderDate.getMonth() === currentMonth &&
               orderDate.getFullYear() === currentYear &&
               order.status === 'fulfilled';
      });
      
      // Sum up the total earnings for this day
      const earnings = dayOrders.reduce((total, order) => total + order.total, 0);
      
      data.push({
        day: day.toString(),
        earnings: earnings,
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const totalEarnings = getTotalEarnings();
  const todayEarnings = getTodayEarnings();

  const calculateWeeklyChange = () => {
    const currentDate = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);
    
    // This week's earnings
    const thisWeekEarnings = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= oneWeekAgo && 
               orderDate <= currentDate &&
               order.status === 'fulfilled';
      })
      .reduce((total, order) => total + order.total, 0);
    
    // Previous week's earnings
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(currentDate.getDate() - 14);
    
    const prevWeekEarnings = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= twoWeeksAgo && 
               orderDate < oneWeekAgo &&
               order.status === 'fulfilled';
      })
      .reduce((total, order) => total + order.total, 0);
    
    if (prevWeekEarnings === 0) return 100; // No previous week data
    
    const percentChange = ((thisWeekEarnings - prevWeekEarnings) / prevWeekEarnings) * 100;
    return Math.round(percentChange);
  };

  const weeklyChange = calculateWeeklyChange();

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, 'MMMM yyyy') : 'Select month'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-med-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time earnings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Today's Earnings
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-med-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todayEarnings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total for {format(new Date(), 'dd MMM yyyy')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Weekly Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-med-blue" />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              weeklyChange >= 0 ? "text-med-green" : "text-med-red"
            )}>
              {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Compared to last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `₹${value}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Earnings']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Bar
                  dataKey="earnings"
                  fill="#2D9CDB"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;
