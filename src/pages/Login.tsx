
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
          
          {/* Demo Accounts */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <p><span className="font-medium">Admin:</span> admin@ezdanny.com</p>
              <p><span className="font-medium">Manager:</span> darahas@ezdanny.com</p>
              <p><span className="font-medium">Employee:</span> hema@ezdanny.com</p>
              <p className="mt-2">Password for all: password123</p>
            </div>
          </div>
          
          {/* Powered by */}
          <div className="text-center pt-8">
            <p className="text-xs text-muted-foreground">powered by <span className="font-medium">Evolutyz</span></p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Illustration */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-white to-orange-50">
        {/* Geometric Shapes */}
        <div className="absolute inset-0">
          {/* Large Orange Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary rounded-full opacity-20"></div>
          
          {/* Orange Triangle */}
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[200px] border-l-transparent border-b-[200px] border-b-primary opacity-30"></div>
          
          {/* Small Orange Shapes */}
          <div className="absolute top-20 right-20 w-16 h-16 bg-primary rounded-full opacity-25"></div>
          <div className="absolute bottom-32 left-16 w-12 h-12 bg-primary/60 rounded-full"></div>
          
          {/* Hanging Lamp */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-16 bg-muted-foreground/30"></div>
            <div className="w-20 h-12 bg-green-600 rounded-full relative">
              <div className="absolute bottom-0 inset-x-2 h-6 bg-yellow-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
        
        {/* Character Illustration Area */}
        <div className="absolute bottom-16 right-16 text-6xl">
          <div className="relative">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-4xl">👨‍💻</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
