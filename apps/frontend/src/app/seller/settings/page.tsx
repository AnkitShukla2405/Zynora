import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Lock, User } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your account preferences and settings.</p>
            </div>

            {/* Account Settings */}
            <Card className="border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5" /> Account Information
                    </CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="Ankit" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="Shukla" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="ankit.shukla@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                    </div>
                    <div className="pt-2 flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5" /> Notifications
                    </CardTitle>
                    <CardDescription>Manage how you receive alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="space-y-0.5">
                            <Label className="text-base">Order Alerts</Label>
                            <p className="text-sm text-muted-foreground">Receive emails for new orders.</p>
                        </div>
                        <input type="checkbox" className="toggle-checkbox w-5 h-5 accent-primary" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="space-y-0.5">
                            <Label className="text-base">Low Stock Warnings</Label>
                            <p className="text-sm text-muted-foreground">Get notified when stock is low.</p>
                        </div>
                        <input type="checkbox" className="toggle-checkbox w-5 h-5 accent-primary" defaultChecked />
                    </div>
                    <div className="pt-2 flex justify-end">
                        <Button variant="outline">Update Preferences</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5" /> Security
                    </CardTitle>
                    <CardDescription>Change your password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currPass">Current Password</Label>
                        <Input id="currPass" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPass">New Password</Label>
                        <Input id="newPass" type="password" />
                    </div>
                    <div className="pt-2 flex justify-end">
                        <Button variant="destructive">Change Password</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
