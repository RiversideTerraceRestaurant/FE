import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api";

function base64UrlToUint8Array(value: string) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const binary = atob((value + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches
  || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

export function PushNotificationButton() {
  const { toast } = useToast();
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker.register("/sw.js")
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setSubscribed(Boolean(subscription)))
      .catch(() => undefined);
  }, [supported]);

  const toggle = async () => {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos && !isStandalone()) {
      toast({ title: "Add the app to your Home Screen", description: "In Safari, tap Share, then Add to Home Screen. Open the installed app and tap the bell again." });
      return;
    }
    if (!supported) {
      toast({ title: "Notifications are not supported", description: "Use iOS 16.4 or later and open the installed Home Screen app.", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const current = await registration.pushManager.getSubscription();
      if (current) {
        await adminApi.unsubscribePush(current.endpoint);
        await current.unsubscribe();
        setSubscribed(false);
        toast({ title: "Notifications turned off" });
        return;
      }
      const config = await adminApi.pushConfig();
      if (!config.enabled || !config.publicKey) throw new Error("Push notifications have not been configured on the server.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission was not granted. You can change it in iPhone Settings > Notifications.");
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlToUint8Array(config.publicKey) });
      await adminApi.subscribePush(subscription.toJSON());
      setSubscribed(true);
      toast({ title: "Notifications are on", description: "This device will be notified when a customer confirms a new booking." });
    } catch (error) {
      toast({ title: "Could not enable notifications", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally { setBusy(false); }
  };

  return (
    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-full" onClick={toggle} disabled={busy} aria-label={subscribed ? "Turn off notifications" : "Turn on notifications"}>
      {subscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
    </Button>
  );
}
