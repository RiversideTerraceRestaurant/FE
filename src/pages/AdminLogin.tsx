import { FormEvent, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ChefHat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminAuth } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const redirectTo = searchParams.get("redirect") || "/admin-panel/time-map";

  if (adminAuth.isLoggedIn()) {
    return <Navigate to={redirectTo} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await adminAuth.login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast({ title: t("adminLoginFailed"), description: error instanceof Error ? error.message : t("adminInvalidCredentials"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <ChefHat className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold">Riverside Terrace</h1>
          <p className="text-muted-foreground">{t("adminAccess")}</p>
        </div>
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>{t("adminSignIn")}</CardTitle>
            <CardDescription>{t("adminUseAccount")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="username">{t("adminUsername")}</Label>
                <Input id="username" type="email" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
              </div>
              <div>
                <Label htmlFor="password">{t("adminPassword")}</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
              </div>
              <Button className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("adminSignIn")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
