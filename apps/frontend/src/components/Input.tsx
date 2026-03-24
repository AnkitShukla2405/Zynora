import * as React from 'react';
import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: FieldError | undefined;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === 'password';

        const togglePassword = () => setShowPassword(!showPassword);

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={isPassword ? (showPassword ? 'text' : 'password') : type}
                        className={cn(
                            "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            error && "border-red-500 focus-visible:ring-red-100 focus-visible:border-red-500",
                            icon && "pl-10",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {icon}
                        </div>
                    )}
                    {isPassword && (
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
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
Input.displayName = 'Input';

export { Input };
