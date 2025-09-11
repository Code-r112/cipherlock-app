
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-4 text-xl sm:text-2xl text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
              By accessing and using CipherLock (the "Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">2. Service Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
              CipherLock is a web-based tool that provides client-side file encryption and decryption. All processing is done locally in your browser. No files are uploaded to our servers.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">3. User Responsibilities</CardTitle>
          </Header>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
              You are solely responsible for the management and security of your secret keys. <strong>If you lose your secret key, your encrypted data will be permanently inaccessible. We have no way to recover lost keys or decrypt your files.</strong>
            </p>
            <p>
              You agree not to use the service for any illegal or unauthorized purpose.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">4. Disclaimer of Warranties</CardTitle>
          </Header>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
              The Service is provided "as is". We make no warranty that the service will meet your requirements, be uninterrupted, timely, secure, or error-free.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">5. Limitation of Liability</CardTitle>
          </Header>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
              In no event shall CipherLock or its developers be liable for any direct, indirect, incidental, special, or consequential damages (including, but not limited to, loss of data) resulting from the use or the inability to use the service.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">6. Changes to Terms</CardTitle>
          </Header>
          <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
              We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these page periodically.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
