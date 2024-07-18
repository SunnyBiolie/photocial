import { MainNavigationBar } from "@/components/navigation/main-navbar";

interface Props {
  children: React.ReactNode;
}

export default function WithNavbarLayout({ children }: Props) {
  return (
    <div className="w-screen h-screen">
      <MainNavigationBar />
      {/* <div className="mx-auto w-[calc(72vh)] min-w-[302px] max-w-[632px]"> */}
      <div className="mx-auto w-fit">{children}</div>
    </div>
  );
}
