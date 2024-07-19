import { AppNavigationBar } from "@/components/others/app-navbar";

interface Props {
  children: React.ReactNode;
}

export default function WithNavbarLayout({ children }: Props) {
  return (
    <div className="w-full h-full">
      {/* <div className="mx-auto w-[calc(72vh)] min-w-[302px] max-w-[632px]"> */}
      <div className="mx-auto md:pb-0 pb-[var(--app-navbar-horizontal-height)] w-fit">
        {children}
      </div>
      <AppNavigationBar />
    </div>
  );
}
