interface Props {
  params: {
    username: string;
  };
  children: React.ReactNode;
}

export default function ProfileLayout({ params, children }: Props) {
  return (
    <div>
      <div>
        <div className="size-28 bg-neutral-500 rounded-full overflow-hidden"></div>
        <div></div>
      </div>
      {children}
    </div>
  );
}
