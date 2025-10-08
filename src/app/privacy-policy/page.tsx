
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Breadcrumb />
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-xl sm:text-2xl text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
              Welcome to CipherLock. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.
            </p>
            <p>
              The core principle of CipherLock is that your files and the keys to decrypt them never leave your device. All encryption and decryption processes happen locally in your browser.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
              For users who do not create an account, we collect no personal information or data.
            </p>
            <p>
              For users who choose to sign in, we collect the following information provided by our authentication partner (e.g., Google):
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Your display name</li>
              <li>Your email address</li>
              <li>Your profile picture URL</li>
              <li>A unique user ID</li>
            </ul>
            <p>
              Additionally, for logged-in users, we store metadata related to your activity on our servers, including:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>An activity log of encryption/decryption actions (e.g., "Encrypted file 'document.ciph'"). This log does not contain the content of your files.</li>
              <li>A salted hash of the keys you use, not the keys themselves. This is used for security analysis without exposing your actual keys.</li>
              <li>Any secret keys you voluntarily save to your Key Vault. These are stored securely and are only accessible by you.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2">
                <li>To provide and maintain our service, including account-specific features like the Key Vault and Activity Log.</li>
                <li>To improve and personalize your experience.</li>
                <li>To provide AI-powered features like filename suggestions and security analysis.</li>
                <li>To monitor the usage of our service and prevent abuse.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
            <p>
                Your files are never transmitted to our servers. Your secret keys are either never transmitted or, if saved, are protected by Firestore Security Rules, which restrict access to only the authenticated user.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
