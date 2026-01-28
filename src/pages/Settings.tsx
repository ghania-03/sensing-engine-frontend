import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTheme } from '@/hooks/useTheme';
import { Settings as SettingsIcon, Moon, Sun, Bell, Globe, Clock, Palette } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyDigest: true,
  });
  const [preferences, setPreferences] = useState({
    defaultForecastWindow: '14',
    currency: 'USD',
    numberFormat: 'en-US',
    timezone: 'America/New_York',
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Page Header */}
        <div className="animate-fade-up">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary" />
            Settings
          </h2>
          <p className="text-muted-foreground mt-1">Manage your dashboard preferences</p>
        </div>

        {/* Theme Settings */}
        <div className="bg-card rounded-xl border p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
              <p className="text-sm text-muted-foreground">Customize the look and feel</p>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-warning" />
                )}
                <div>
                  <Label htmlFor="dark-mode" className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
                </div>
              </div>
              <Switch 
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-xl border p-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Manage how you receive alerts</p>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif" className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch 
                id="email-notif"
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notif" className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch 
                id="push-notif"
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notif" className="text-sm font-medium">SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">Critical alerts via text message</p>
              </div>
              <Switch 
                id="sms-notif"
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-digest" className="text-sm font-medium">Weekly Digest</Label>
                <p className="text-xs text-muted-foreground">Summary email every Monday</p>
              </div>
              <Switch 
                id="weekly-digest"
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Forecast Preferences */}
        <div className="bg-card rounded-xl border p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Forecast Preferences</h3>
              <p className="text-sm text-muted-foreground">Default settings for demand forecasting</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Default Forecast Window</Label>
              <Select 
                value={preferences.defaultForecastWindow}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, defaultForecastWindow: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select window" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Timezone</Label>
              <Select 
                value={preferences.timezone}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-card rounded-xl border p-6 animate-fade-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Regional Settings</h3>
              <p className="text-sm text-muted-foreground">Currency and number formatting</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Currency</Label>
              <Select 
                value={preferences.currency}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                  <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Number Format</Label>
              <Select 
                value={preferences.numberFormat}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, numberFormat: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">1,234.56</SelectItem>
                  <SelectItem value="de-DE">1.234,56</SelectItem>
                  <SelectItem value="fr-FR">1 234,56</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Button onClick={handleSave} size="lg">
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
