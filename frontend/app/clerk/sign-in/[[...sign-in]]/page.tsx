import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <SignIn path="/clerk/sign-in" />
    </div>
  );
}
