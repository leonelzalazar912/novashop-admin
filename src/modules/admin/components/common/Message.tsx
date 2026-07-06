type MessageProps = {
  message: string;
};

export function Message({ message }: MessageProps) {
  if (!message) return null;

  return <p className="form-message">{message}</p>;
}