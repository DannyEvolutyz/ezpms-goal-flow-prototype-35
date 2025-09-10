
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
              <img 
                src="/lovable-uploads/b8529317-fe8a-452e-99ed-83c5b41d9fd8.png" 
                alt="Evolutyz" 
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Illustration */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {/* Orange Wave Background */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/b49f6bde-e0b5-4c23-9551-ab3bf5315780.png" 
            alt="Orange wave background" 
            className="absolute top-0 right-0 w-full h-full object-cover object-right"
          />
        </div>
        
        {/* Hanging Lamp */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <img 
            src="/lovable-uploads/09294984-baed-4657-aa9c-628163e8e2bd.png" 
            alt="Hanging lamp" 
            className="w-20 h-auto"
          />
        </div>
        
        {/* Character Illustration */}
        <div className="absolute bottom-8 right-8 z-10">
          <img 
            src="/lovable-uploads/00441965-4a90-4f30-bacb-b0a09edfa3e2.png" 
            alt="3D Character with phone" 
            className="w-80 h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
