import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { cn } from '../../utils/cn';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
        positive?: boolean;
    };
    className?: string;
    color?: 'default' | 'forest' | 'blue' | 'amber' | 'emerald' | 'rose' | 'purple';
}

const colorStyles = {
    default: {
        iconBg: 'bg-neutral-100',
        iconColor: 'text-neutral-600',
    },
    forest: {
        iconBg: 'bg-forest-100',
        iconColor: 'text-forest-600',
    },
    blue: {
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
    },
    amber: {
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
    },
    emerald: {
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
    },
    rose: {
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
    },
    purple: {
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
    },
};

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
    color = 'default',
}: StatCardProps) {
    const styles = colorStyles[color];

    return (
        <Card className={cn('overflow-hidden', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">{title}</CardTitle>
                <div className={cn('p-2 rounded-full', styles.iconBg)}>
                    <Icon className={cn('h-4 w-4', styles.iconColor)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center text-xs text-neutral-500 mt-1">
                        {trend && (
                            <span className={cn('font-medium mr-2', trend.positive ? 'text-emerald-600' : 'text-rose-600')}>
                                {trend.positive ? '+' : ''}{trend.value}%
                            </span>
                        )}
                        {description && <span>{description}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
