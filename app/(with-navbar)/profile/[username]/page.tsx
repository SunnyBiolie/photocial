interface Props {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: Props) {
  return <div className="">{params.username}</div>;
}
