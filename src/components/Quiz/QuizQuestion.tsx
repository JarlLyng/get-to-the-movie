'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type QuizQuestionProps<T extends string> = {
  question: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
};

export function QuizQuestion<T extends string>({
  question,
  value,
  onChange,
  options,
}: QuizQuestionProps<T>) {
  return (
    <div className="space-y-6">
      <Label className="text-2xl md:text-3xl font-bold text-slate-100 block mb-6 text-center">
        {question}
      </Label>
      <RadioGroup value={value || ''} onValueChange={onChange} className="space-y-4">
        {options.map((option) => (
          <div 
            key={option.value} 
            onClick={() => onChange(option.value)}
            className="flex items-center space-x-4 p-5 rounded-xl border-2 border-slate-800 bg-slate-800/30 hover:bg-slate-800/50 hover:border-orange-500 transition-all cursor-pointer group data-[selected=true]:border-orange-500 data-[selected=true]:bg-slate-800/70"
            data-selected={value === option.value}
          >
            <RadioGroupItem 
              value={option.value} 
              id={option.value}
              className="border-slate-600 group-hover:border-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500 shrink-0 size-5 pointer-events-none"
            />
            <Label
              htmlFor={option.value}
              className="text-lg font-medium text-slate-200 cursor-pointer flex-1 leading-relaxed group-hover:text-white transition-colors pointer-events-none"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

