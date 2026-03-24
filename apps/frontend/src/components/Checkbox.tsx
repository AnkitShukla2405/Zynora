import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { FieldError } from 'react-hook-form';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    error?: FieldError;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col space-y-1">
                <div className="flex items-start space-x-2">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            ref={ref}
                            className={cn(
                                "peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-slate-300 shadow-sm checked:bg-primary checked:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
                                className
                            )}
                            {...props}
                        />
                        <Check className="pointer-events-none absolute h-3 w-3 text-black opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200" strokeWidth={3} />
                    </div>
                    {label && (
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 select-none cursor-pointer" htmlFor={props.id}>
                            {label}
                        </label>
                    )}
                </div>
                {error && (
                    <p className="text-[0.8rem] font-medium text-red-500 animate-accordion-down">
                        {error.message}
                    </p>
                )}
            </div>
        );
    }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
