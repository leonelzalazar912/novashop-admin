type EmptyStateProps = {
  message: string;
  colSpan: number;
};

export function EmptyState({ message, colSpan }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan}>{message}</td>
    </tr>
  );
}