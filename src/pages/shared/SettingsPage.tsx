import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Smartphone,
  Mail,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const settingSections: SettingSection[] = [
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Manage your notification preferences',
    icon: Bell
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the look and feel',
    icon: Moon
  },
  {
    id: 'language',
    title: 'Language & Region',
    description: 'Set your preferred language and region',
    icon: Globe
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Manage security settings and 2FA',
    icon: Shield
  }
];

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('notifications');
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    
    // Appearance
    darkMode: false,
    compactMode: false,
    
    // Language
    language: 'en',
    timezone: 'America/Los_Angeles',
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    toast.success('Setting updated');
  };

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive updates via email</p>
          </div>
        </div>
        <button
          onClick={() => handleToggle('emailNotifications')}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            settings.emailNotifications ? "bg-blue-600" : "bg-gray-300"
          )}
        >
          <div className={cn(
            "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
            settings.emailNotifications ? "translate-x-6" : "translate-x-0.5"
          )} />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Push Notifications</p>
            <p className="text-sm text-gray-500">Receive push notifications</p>
          </div>
        </div>
        <button
          onClick={() => handleToggle('pushNotifications')}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            settings.pushNotifications ? "bg-blue-600" : "bg-gray-300"
          )}
        >
          <div className={cn(
            "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
            settings.pushNotifications ? "translate-x-6" : "translate-x-0.5"
          )} />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">SMS Notifications</p>
            <p className="text-sm text-gray-500">Receive text message updates</p>
          </div>
        </div>
        <button
          onClick={() => handleToggle('smsNotifications')}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            settings.smsNotifications ? "bg-blue-600" : "bg-gray-300"
          )}
        >
          <div className={cn(
            "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
            settings.smsNotifications ? "translate-x-6" : "translate-x-0.5"
          )} />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Marketing Emails</p>
            <p className="text-sm text-gray-500">Receive promotional content</p>
          </div>
        </div>
        <button
          onClick={() => handleToggle('marketingEmails')}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            settings.marketingEmails ? "bg-blue-600" : "bg-gray-300"
          )}
        >
          <div className={cn(
            "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
            settings.marketingEmails ? "translate-x-6" : "translate-x-0.5"
          )} />
        </button>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="font-medium text-gray-900">Dark Mode</p>
          <p className="text-sm text-gray-500">Use dark theme</p>
        </div>
        <button
          onClick={() => handleToggle('darkMode')}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            settings.darkMode ? "bg-blue-600" : "bg-gray-300"
          )}
        >
          <div className={cn(
            "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
            settings.darkMode ? "translate-x-6" : "translate-x-0.5"
          )} />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="font-medium text-gray-900">Compact Mode</p>
          <p className="text-sm text-gray-500">Reduce spacing for more content</p>
        </div>
        <button
          onClick={() => handleToggle('compactMode')}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            settings.compactMode ? "bg-blue-600" : "bg-gray-300"
          )}
        >
          <div className={cn(
            "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
            settings.compactMode ? "translate-x-6" : "translate-x-0.5"
          )} />
        </button>
      </div>
    </div>
  );

  const renderLanguageSettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-xl">
        <label className="block font-medium text-gray-900 mb-2">Language</label>
        <select
          value={settings.language}
          onChange={(e) => {
            setSettings(prev => ({ ...prev, language: e.target.value }));
            toast.success('Language updated');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ko">Korean</option>
        </select>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <label className="block font-medium text-gray-900 mb-2">Timezone</label>
        <select
          value={settings.timezone}
          onChange={(e) => {
            setSettings(prev => ({ ...prev, timezone: e.target.value }));
            toast.success('Timezone updated');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="UTC">UTC</option>
        </select>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
          <p className="text-sm text-gray-500">Add an extra layer of security</p>
        </div>
        <button
          onClick={() => handleToggle('twoFactorAuth')}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            settings.twoFactorAuth ? "bg-blue-600" : "bg-gray-300"
          )}
        >
          <div className={cn(
            "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
            settings.twoFactorAuth ? "translate-x-6" : "translate-x-0.5"
          )} />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="font-medium text-gray-900">Login Alerts</p>
          <p className="text-sm text-gray-500">Get notified of new logins</p>
        </div>
        <button
          onClick={() => handleToggle('loginAlerts')}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            settings.loginAlerts ? "bg-blue-600" : "bg-gray-300"
          )}
        >
          <div className={cn(
            "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
            settings.loginAlerts ? "translate-x-6" : "translate-x-0.5"
          )} />
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'language':
        return renderLanguageSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your preferences and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {settingSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <p className="font-medium text-sm">{section.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {settingSections.find(s => s.id === activeSection)?.title}
            </h2>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
