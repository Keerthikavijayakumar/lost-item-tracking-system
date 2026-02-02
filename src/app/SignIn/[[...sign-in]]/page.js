import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" />
            </div>
        </div>
    );
}
