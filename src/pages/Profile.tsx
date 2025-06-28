import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  Lock,
  Save,
  Loader2,
  Calendar,
  Globe,
  Bell,
  Shield,
  Package,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout, loading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [preferences, setPreferences] = useState({
    newsletter: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: "en",
    favoriteCategories: [] as string[],
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.profile?.dateOfBirth || "",
        gender: user.profile?.gender || "",
      });

      setAddress({
        street: user.profile?.address?.street || "",
        city: user.profile?.address?.city || "",
        state: user.profile?.address?.state || "",
        postalCode: user.profile?.address?.postalCode || "",
        country: user.profile?.address?.country || "India",
      });

      setPreferences({
        newsletter: user.preferences?.newsletter ?? true,
        emailNotifications: user.preferences?.notifications?.email ?? true,
        smsNotifications: user.preferences?.notifications?.sms ?? false,
        pushNotifications: user.preferences?.notifications?.push ?? true,
        language: user.preferences?.language || "en",
        favoriteCategories: user.preferences?.favoriteCategories || [],
      });
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?redirect=/profile");
    }
  }, [user, loading, navigate]);

  const handlePersonalInfoSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const success = await updateProfile({
        name: personalInfo.name,
        phone: personalInfo.phone,
        profile: {
          dateOfBirth: personalInfo.dateOfBirth,
          gender: personalInfo.gender,
        },
      });

      if (success) {
        toast({
          title: "Profile Updated",
          description:
            "Your personal information has been updated successfully.",
        });
      }
    } catch (err) {
      setError("Failed to update personal information");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const success = await updateProfile({
        profile: {
          address,
        },
      });

      if (success) {
        toast({
          title: "Address Updated",
          description: "Your address has been updated successfully.",
        });
      }
    } catch (err) {
      setError("Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const success = await updateProfile({
        preferences: {
          newsletter: preferences.newsletter,
          notifications: {
            email: preferences.emailNotifications,
            sms: preferences.smsNotifications,
            push: preferences.pushNotifications,
          },
          language: preferences.language,
          favoriteCategories: preferences.favoriteCategories,
        },
      });

      if (success) {
        toast({
          title: "Preferences Updated",
          description: "Your preferences have been updated successfully.",
        });
      }
    } catch (err) {
      setError("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const success = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        });
      }
    } catch (err) {
      setError("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Account
            </h1>
            <p className="text-gray-600">
              Manage your profile, preferences, and account settings
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={personalInfo.name}
                        onChange={(e) =>
                          setPersonalInfo((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={personalInfo.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) =>
                          setPersonalInfo((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) =>
                          setPersonalInfo((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={personalInfo.gender}
                        onValueChange={(value) =>
                          setPersonalInfo((prev) => ({
                            ...prev,
                            gender: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handlePersonalInfoSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                  <CardDescription>
                    Update your shipping and billing address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={address.street}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      placeholder="Enter your street address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={address.state}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={address.postalCode}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            postalCode: e.target.value,
                          }))
                        }
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={address.country}
                      onValueChange={(value) =>
                        setAddress((prev) => ({ ...prev, country: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United States">
                          United States
                        </SelectItem>
                        <SelectItem value="United Kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAddressSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Address
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your notification and language preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newsletter">Newsletter</Label>
                          <p className="text-sm text-gray-500">
                            Receive updates about new products and offers
                          </p>
                        </div>
                        <Switch
                          id="newsletter"
                          checked={preferences.newsletter}
                          onCheckedChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              newsletter: checked,
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-gray-500">
                            Receive order updates and promotions via email
                          </p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={preferences.emailNotifications}
                          onCheckedChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              emailNotifications: checked,
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smsNotifications">
                            SMS Notifications
                          </Label>
                          <p className="text-sm text-gray-500">
                            Receive order updates via SMS
                          </p>
                        </div>
                        <Switch
                          id="smsNotifications"
                          checked={preferences.smsNotifications}
                          onCheckedChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              smsNotifications: checked,
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushNotifications">
                            Push Notifications
                          </Label>
                          <p className="text-sm text-gray-500">
                            Receive browser notifications
                          </p>
                        </div>
                        <Switch
                          id="pushNotifications"
                          checked={preferences.pushNotifications}
                          onCheckedChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              pushNotifications: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Language</h3>
                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) =>
                          setPreferences((prev) => ({
                            ...prev,
                            language: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handlePreferencesSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order History
                  </CardTitle>
                  <CardDescription>
                    View and track your past orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    View Your Orders
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Access your complete order history, track current orders,
                    and view order details.
                  </p>
                  <Button
                    onClick={() => navigate("/orders")}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    View Order History
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Change your password and manage account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="Confirm your new password"
                    />
                  </div>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Logout Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Actions that cannot be undone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
