// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { useLocation } from '@/contexts/LocationContext';
// import { Card } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { MapPin, QrCode } from 'lucide-react';
// import { API_BASE_URL } from '@/config';

// const formSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   shopName: z.string().min(2, 'Shop name must be at least 2 characters'),
//   gstNumber: z.string().min(5, 'Please enter a valid GST number'),
//   email: z.string().email('Please enter a valid email'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// type FormValues = z.infer<typeof formSchema>;

// const Register = () => {
//   const { register: registerUser, loading } = useAuth();
//   const { requestLocationPermission, userLocation, locationPermissionGranted } = useLocation();
//   const [activeTab, setActiveTab] = useState('basic');
//   const [qrCodeUrl, setQrCodeUrl] = useState('');
//   const [data, setData] = useState({
//      name: '',
//       shopName: '',
//       gstNumber: '',
//       email: '',
//       password: '',
//   });
//   const [qrFile, setQrFile] = useState<File | undefined>();

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: '',
//       shopName: '',
//       gstNumber: '',
//       email: '',
//       password: '',
//     },
//   });

//   const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setQrFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setQrCodeUrl(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };


// const handleChange=(e)=>{
// setData({...data,[e.target.name]:e.target.value})
// } 

//   const handleSubmit = async (data: FormValues) => {
//     // Check location permission (as before)
//     console.log("object")
//     let locationPermission = locationPermissionGranted;
//     if (!locationPermission) {
//       locationPermission = await requestLocationPermission();
//       if (!locationPermission) return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('name', data.name);
//       formData.append('shopName', data.shopName);
//       formData.append('gstNumber', data.gstNumber);
//       formData.append('email', data.email);
//       formData.append('password', data.password);

//       if (userLocation) {
//         formData.append('shopLocation', JSON.stringify(userLocation));
//       }
//       if (qrFile) {
//         formData.append('paymentQrCode', qrFile);  // important: key must match backend multer field name
//       }

//       // Now send formData to your API endpoint using fetch or axios:
//       const response = await fetch(`${API_BASE_URL}/api/sellers/register`, {
//         method: "POST",
//         body: formData,
//       });

//       console.log(response, "response")

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert('Registration failed: ' + (errorData.error || 'Unknown error'));
//         return;
//       }

//       const result = await response.json();
//       console.log(result,"result")
//       alert('Registration successful!');
//       // Redirect or clear form as needed
//     } catch (err) {
//       alert('Registration error: ' + err.message);
//     }
//   };


//   const goToNextTab = () => {
//     if (activeTab === 'basic') {
//       // Basic validation before moving to location
//       const { name, shopName, gstNumber, email, password } = form.getValues();
//       if (!name || !shopName || !gstNumber || !email || !password) {
//         form.trigger(['name', 'shopName', 'gstNumber', 'email', 'password']);
//         return;
//       }
//       setActiveTab('location');
//     } else if (activeTab === 'location') {
//       requestLocationPermission().then(success => {
//         if (success) {
//           setActiveTab('qr');
//         }
//       });
//     }
//   };

//   const goToPrevTab = () => {
//     if (activeTab === 'location') {
//       setActiveTab('basic');
//     } else if (activeTab === 'qr') {
//       setActiveTab('location');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-med-light-blue/50 p-4">
//       <Card className="p-8 rounded-lg shadow-md w-full max-w-md bg-white">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Create Seller Account</h1>
//           <p className="text-gray-600 mt-1">Join MediSeller to grow your business</p>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-3 mb-6">
//             <TabsTrigger value="basic">Basic Info</TabsTrigger>
//             <TabsTrigger value="location">Location</TabsTrigger>
//             <TabsTrigger value="qr">Payment QR</TabsTrigger>
//           </TabsList>

//           <Form {...form}>
//             {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> */}
//             <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//               <TabsContent value="basic">
//                 <div className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Your Name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="John Doe" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="shopName"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Shop Name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="ABC Pharmacy" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="gstNumber"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>GST Number</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Your GST registration number" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <Input placeholder="you@example.com" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Password</FormLabel>
//                         <FormControl>
//                           <Input type="password" placeholder="••••••••" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <Button
//                     type="button"
//                     className="w-full bg-med-blue hover:bg-med-blue/90"
//                     onClick={goToNextTab}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </TabsContent>

//               <TabsContent value="location">
//                 <div className="space-y-4">
//                   <div className="bg-med-light-blue/30 p-4 rounded-md">
//                     <div className="flex items-center mb-2">
//                       <MapPin className="h-5 w-5 mr-2 text-med-blue" />
//                       <h3 className="font-medium">Shop Location</h3>
//                     </div>

//                     <p className="text-sm text-gray-600 mb-4">
//                       We need access to your location to help customers find your shop.
//                     </p>

//                     <Button
//                       onClick={() => requestLocationPermission()}
//                       className="w-full"
//                       disabled={locationPermissionGranted}
//                     >
//                       {locationPermissionGranted ? 'Location Access Granted' : 'Grant Location Access'}
//                     </Button>

//                     {userLocation && (
//                       <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
//                         Location detected successfully!
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={goToPrevTab}
//                       className="flex-1"
//                     >
//                       Back
//                     </Button>
//                     <Button
//                       type="button"
//                       onClick={goToNextTab}
//                       className="flex-1 bg-med-blue hover:bg-med-blue/90"
//                       disabled={!locationPermissionGranted}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="qr">
//                 <div className="space-y-4">
//                   <div className="bg-med-light-blue/30 p-4 rounded-md">
//                     <div className="flex items-center mb-2">
//                       <QrCode className="h-5 w-5 mr-2 text-med-blue" />
//                       <h3 className="font-medium">Payment QR Code</h3>
//                     </div>

//                     <p className="text-sm text-gray-600 mb-4">
//                       Upload your payment QR code to receive payments directly.
//                     </p>

//                     <div className="flex justify-center mb-4">
//                       <div className="w-40 h-40 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-white">
//                         {qrCodeUrl ? (
//                           <img src={qrCodeUrl} alt="QR Code" className="max-w-full max-h-full" />
//                         ) : (
//                           <QrCode className="h-12 w-12 text-gray-300" />
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleQrUpload}
//                         className="cursor-pointer"
//                       />
//                       <FormDescription className="text-center mt-2 text-sm">
//                         Upload an image of your UPI or payment QR code
//                       </FormDescription>
//                     </div>
//                   </div>

//                   <div className="flex gap-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={goToPrevTab}
//                       className="flex-1"
//                     >
//                       Back
//                     </Button>
//                     <Button
//                       type="submit"
//                       className="flex-1 bg-med-blue hover:bg-med-blue/90"
//                       disabled={loading}
//                     >
//                       {loading ? 'Creating Account...' : 'Create Account'}
//                     </Button>
//                   </div>
//                 </div>
//               </TabsContent>
//             </form>
//           </Form>
//         </Tabs>

//         <div className="text-center mt-6">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-med-blue hover:text-med-blue/90">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, QrCode } from 'lucide-react';
import { API_BASE_URL } from '@/config';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  shopName: z.string().min(2, 'Shop name must be at least 2 characters'),
  gstNumber: z.string().min(5, 'Please enter a valid GST number'),
  phone: z.string().min(7, 'Please enter a valid phone number'),  // added phone here
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const { requestLocationPermission, userLocation, locationPermissionGranted } = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'qr'>('basic');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrFile, setQrFile] = useState<File | undefined>(undefined);
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      shopName: '',
      gstNumber: '',
      phone: "",
      email: '',
      password: '',
    },
  });

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodeUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (formData: FormValues) => {
    let locationPermission = locationPermissionGranted;
    if (!locationPermission) {
      locationPermission = await requestLocationPermission();
      if (!locationPermission) return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('shopName', formData.shopName);
      data.append('gstNumber', formData.gstNumber);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('password', formData.password);

      if (userLocation) {
        data.append('shopLocation', JSON.stringify(userLocation));
      }
      if (qrFile) {
        data.append('paymentQrCode', qrFile); // multer field name must match
      }

      const response = await fetch(`${API_BASE_URL}/api/sellers/register`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Login failed",
          description: errorData.error,
          variant: "destructive",
        });
        // alert('Registration failed: ' + (errorData.error || 'Unknown error'));
        return;
      }

      const result = await response.json();
      toast({
        title: "Registration successful",
        description: "Your seller account has been created.",
      });
      navigate("/login")
      // TODO: Redirect or reset form here if needed
    } catch (err) {
      if (err instanceof Error) {
        alert('Registration error: ' + err.message);
      } else {
        alert('Registration error: Unknown error');
      }
    }
  };

  const goToNextTab = () => {
    if (activeTab === 'basic') {
      // Trigger validation for all fields
      form.trigger().then(valid => {
        if (valid) {
          setActiveTab('location');
        }
      });
    } else if (activeTab === 'location') {
      requestLocationPermission().then(success => {
        if (success) {
          setActiveTab('qr');
        }
      });
    }
  };

  const goToPrevTab = () => {
    if (activeTab === 'location') {
      setActiveTab('basic');
    } else if (activeTab === 'qr') {
      setActiveTab('location');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-med-light-blue/50 p-4">
      <Card className="p-8 rounded-lg shadow-md w-full max-w-md bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Seller Account</h1>
          <p className="text-gray-600 mt-1">Join MediSeller to grow your business</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'location' | 'qr')}
          className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="qr">Payment QR</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <TabsContent value="basic">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shopName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop Name</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Pharmacy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gstNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your GST registration number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="text"     // changed from number to text
                            placeholder="Your Phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    className="w-full bg-med-blue hover:bg-med-blue/90"
                    onClick={goToNextTab}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="location">
                <div className="space-y-4">
                  <div className="bg-med-light-blue/30 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 mr-2 text-med-blue" />
                      <h3 className="font-medium">Shop Location</h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      We need access to your location to help customers find your shop.
                    </p>

                    <Button
                      onClick={() => requestLocationPermission()}
                      className="w-full"
                      disabled={locationPermissionGranted}
                    >
                      {locationPermissionGranted ? 'Location Access Granted' : 'Grant Location Access'}
                    </Button>

                    {userLocation && (
                      <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                        Location detected successfully!
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={goToPrevTab} className="flex-1">
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goToNextTab}
                      className="flex-1 bg-med-blue hover:bg-med-blue/90"
                      disabled={!locationPermissionGranted}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qr">
                <div className="space-y-4">
                  <div className="bg-med-light-blue/30 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <QrCode className="h-5 w-5 mr-2 text-med-blue" />
                      <h3 className="font-medium">Payment QR Code</h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Upload your payment QR code to receive payments directly.
                    </p>

                    <div className="flex justify-center mb-4">
                      <div className="w-40 h-40 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-white">
                        {qrCodeUrl ? (
                          <img src={qrCodeUrl} alt="QR Code" className="max-w-full max-h-full" />
                        ) : (
                          <QrCode className="h-12 w-12 text-gray-300" />
                        )}
                      </div>
                    </div>

                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleQrUpload}
                        className="cursor-pointer"
                      />
                      <FormDescription className="text-center mt-2 text-sm">
                        Upload an image of your UPI or payment QR code
                      </FormDescription>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={goToPrevTab} className="flex-1">
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-med-blue hover:bg-med-blue/90"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-med-blue hover:text-med-blue/90">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
