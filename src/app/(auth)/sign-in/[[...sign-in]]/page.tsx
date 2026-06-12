import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl border border-slate-200/60 rounded-2xl",
            headerTitle: "text-slate-900 font-semibold",
            headerSubtitle: "text-slate-500",
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-lg",
            footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
            formFieldInput:
              "rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500",
          },
        }}
      />
    </div>
  );
}
