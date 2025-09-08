interface Props {
  title: string;
  value: string | number;
  trend: string;
}

export default function StatCard({ title, value, trend }: Props) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <div className={`trend ${trend.includes('+') ? 'positive' : 'negative'}`}>
        {trend}
      </div>
    </div>
  );
}