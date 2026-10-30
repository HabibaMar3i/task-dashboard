/** Direction of change shown for a dashboard statistic. */
export type ChangeType = 'positive' | 'negative' | 'neutral';

/** Data displayed by a dashboard statistic card. */
export interface Statistic {
  id: string;
  title: string;
  icon: string;
  value: number;
  change: string;
  changeLabel: string;
  changeType: ChangeType;
  color: string;
}
