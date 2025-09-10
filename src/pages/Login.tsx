
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
  }
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const success = await login(values.email, values.password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Login Title */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-8">Login ✌️</h1>
          </div>
          
          {/* Error Alert */}
          {loginError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-foreground">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="" 
                          {...field} 
                          className="border-0 border-b-2 border-primary rounded-none bg-transparent px-0 py-3 text-base focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
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
                    <FormLabel className="text-base font-medium text-foreground">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="password" 
                          placeholder="" 
                          {...field} 
                          className="border-0 border-b-2 border-primary rounded-none bg-transparent px-0 py-3 text-base focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Forgot Password */}
              <div className="text-left">
                <button type="button" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Forgot Password?
                </button>
              </div>
              
              {/* Login Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-xl text-base h-auto"
              >
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </Button>
            </form>
          </Form>
          
          {/* Powered by */}
          <div className="text-center pt-16">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs text-muted-foreground">powered by</span>
              <div className="flex items-center">
                <span className="text-xs font-bold text-primary">Evolutyz</span>
                <div className="ml-1 w-6 h-3 bg-primary rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Illustration */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {/* Orange Wave Background */}
        <div className="absolute inset-0">
          {/* Main Orange Wave Shape */}
          <div className="absolute top-0 right-0 w-full h-full">
            <svg viewBox="0 0 400 600" className="absolute top-0 right-0 w-full h-full" preserveAspectRatio="none">
              <path d="M100,0 Q200,50 300,0 Q350,100 400,150 L400,600 Q300,550 200,600 Q100,550 0,500 L0,200 Q50,100 100,0 Z" fill="hsl(var(--primary))" />
            </svg>
          </div>
          
          {/* Secondary Orange Elements */}
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary rounded-full opacity-70 transform translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-secondary rounded-full opacity-60"></div>
        </div>
        
        {/* Hanging Lamp */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-1 h-20 bg-gray-400 rounded-full"></div>
          <div className="w-16 h-10 bg-emerald-600 rounded-full relative shadow-lg">
            <div className="absolute bottom-0 left-2 right-2 h-4 bg-yellow-200 rounded-full opacity-80"></div>
          </div>
        </div>
        
        {/* Character Illustration */}
        <div className="absolute bottom-20 right-20 z-10">
          <div className="relative">
            {/* Character */}
            <div className="w-40 h-48 relative">
              {/* Head */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-pink-200 rounded-full"></div>
              {/* Hair */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-18 h-10 bg-gray-600 rounded-t-full"></div>
              {/* Body */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-white rounded-lg"></div>
              {/* Arms */}
              <div className="absolute top-16 left-6 w-8 h-16 bg-pink-200 rounded-full transform -rotate-12"></div>
              <div className="absolute top-16 right-6 w-8 h-16 bg-pink-200 rounded-full transform rotate-12"></div>
              {/* Legs */}
              <div className="absolute bottom-8 left-8 w-6 h-16 bg-teal-400 rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-6 h-16 bg-teal-400 rounded-full"></div>
              {/* Phone in hand */}
              <div className="absolute top-20 right-4 w-3 h-6 bg-yellow-400 rounded-sm"></div>
              {/* Shoes */}
              <div className="absolute bottom-0 left-6 w-8 h-4 bg-gray-800 rounded-full"></div>
              <div className="absolute bottom-0 right-6 w-8 h-4 bg-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
