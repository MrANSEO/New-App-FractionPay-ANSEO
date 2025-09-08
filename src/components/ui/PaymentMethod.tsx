// src/components/ui/PaymentMethodCard.tsx
interface Props {
  provider: string;
  amount: number;
  selected: boolean;
  onPay: () => void;
}

export default function PaymentMethodCard({ provider, amount, selected, onPay }: Props) {
  return (
    <div className={`payment-method-card ${selected ? 'selected' : ''}`} onClick={onPay}>
      <input type="radio" checked={selected} readOnly />
      <label>{provider}</label>
      <span>{amount} €</span>
    </div>
  );
}