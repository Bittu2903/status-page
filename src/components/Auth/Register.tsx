import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UserPlus } from "lucide-react";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!data.session) {
        setError("Check your email for a confirmation link before logging in.");
        return;
      }

      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert([{ name: orgName }])
        .select()
        .single();

      if (orgError) throw orgError;

      const { error: teamError } = await supabase
        .from("team_members")
        .insert([{ user_id: data.user?.id, org_id: org.id, role: "admin" }]);

      if (teamError) throw teamError;

      navigate("/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex items-center justify-center">
          <UserPlus className="h-12 w-12 text-indigo-600" />
          <CardTitle className="text-center text-2xl font-semibold mt-2">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Organization Name"
              value={orgName}
              onChange={(e: any) => setOrgName(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
            <Button
              className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100"
              onClick={() => navigate("/login")}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
