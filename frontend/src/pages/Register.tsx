import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/slices/authSlice"
import { fetchWithAuth } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["student", "organizer", "admin"], { message: "Please select a role" }),
  interests: z.array(z.string()).min(1, { message: "Please select at least one interest" }),
})

const INTEREST_OPTIONS = [
  "Coding", "Tech", "Dance", "Management", "Sports", "Music",
  "Art", "Design", "Business", "Networking", "Literature", "Gaming",
  "Photography", "Film", "Science", "Robotics", "Finance", "Debate"
];

export const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
      interests: [],
    },
  })

  const toggleInterest = (interest: string) => {
    const current = form.getValues("interests");
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    form.setValue("interests", updated, { shouldValidate: true });
  };

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true)
    setError("")
    try {
      const data = await fetchWithAuth("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      })
      dispatch(setUser(data))
      navigate("/onboarding")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background pt-24 pb-12">
      <Card className="w-full max-w-xl glass border-primary/20 rounded-[40px] shadow-2xl overflow-hidden">
        <CardHeader className="text-center space-y-2 pb-8">
          <CardTitle className="text-4xl font-black tracking-tighter">Create Account</CardTitle>
          <CardDescription className="text-sm font-medium">
            Join the elite campus network for AI-powered event discovery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="rounded-2xl border-primary/10 bg-primary/5 focus:bg-background transition-all h-12 font-bold" />
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} className="rounded-2xl border-primary/10 bg-primary/5 focus:bg-background transition-all h-12 font-bold" />
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} {...field} className="rounded-2xl border-primary/10 bg-primary/5 focus:bg-background transition-all h-12 font-bold" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-0 h-full hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Role</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-12 w-full rounded-2xl border border-primary/10 bg-primary/5 px-4 text-sm font-bold focus:border-primary focus:outline-none transition-all appearance-none"
                            {...field}
                          >
                            <option value="student">Student</option>
                            <option value="organizer">Organizer</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem className="h-full flex flex-col">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Interests (Min 1)</FormLabel>
                        <div className="flex-1 flex flex-col space-y-3">
                          <div className="flex flex-wrap gap-1.5 p-3 min-h-[48px] rounded-2xl border border-primary/10 bg-primary/5">
                            {field.value.length > 0 ? (
                              field.value.map(i => (
                                <span key={i} className="px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-tighter">
                                  {i}
                                </span>
                              ))
                            ) : (
                              <span className="text-[9px] text-muted-foreground italic">Select below...</span>
                            )}
                          </div>
                          <div className="flex-1 overflow-y-auto max-h-[160px] grid grid-cols-2 gap-2 pr-1 custom-scrollbar">
                            {INTEREST_OPTIONS.map((opt) => {
                              const isSelected = field.value.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => toggleInterest(opt)}
                                  className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-left border transition-all ${
                                    isSelected 
                                      ? "bg-primary/20 border-primary text-primary" 
                                      : "bg-background/50 border-primary/5 hover:border-primary/20"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
