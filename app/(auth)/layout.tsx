import { AuthSlider } from "@/components/auth/slider";
import { AuthBackgrounds } from "@/data/auth-background";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="size-full flex items-center justify-center">
      <AuthSlider slides={AuthBackgrounds} />
      <div className="fixed">{children}</div>
    </div>
  );
};

export default AuthLayout;
