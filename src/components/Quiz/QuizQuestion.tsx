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
  const questionId = `question-${options[0]?.value || 'default'}`;
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <fieldset>
        <legend id={questionId} className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white block mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
          {question}
        </legend>
        <RadioGroup 
          value={value || ''} 
          onValueChange={onChange} 
          className="space-y-4"
          aria-labelledby={questionId}
        >
        {options.map((option) => (
          <div 
            key={option.value} 
            onClick={() => onChange(option.value)}
            className="relative flex items-center p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group data-[selected=true]:border-primary data-[selected=true]:bg-primary/10 overflow-hidden"
            data-selected={value === option.value}
          >
            {value === option.value && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary glowing-border animate-pulse shadow-[0_0_15px_var(--iamjarl-primary)]"></div>
            )}
            <RadioGroupItem 
              value={option.value} 
              id={option.value}
              className="sr-only" // Hidden radio
            />
            <Label
              htmlFor={option.value}
              className={`text-lg md:text-xl font-medium cursor-pointer flex-1 leading-relaxed transition-colors ${value === option.value ? 'text-white' : 'text-white/70 group-hover:text-white'}`}
            >
              {option.label}
            </Label>
            
            <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${value === option.value ? 'border-primary' : 'border-white/20 group-hover:border-white/50'}`}>
              {value === option.value && <div className="size-3 rounded-full bg-primary shadow-[0_0_8px_var(--iamjarl-primary)]" />}
            </div>
          </div>
        ))}
        </RadioGroup>
      </fieldset>
    </div>
  );
}

