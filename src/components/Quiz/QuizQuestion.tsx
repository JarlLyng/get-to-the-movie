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
    <div className="space-y-6">
      <fieldset>
        <legend id={questionId} className="text-2xl md:text-3xl font-bold text-foreground block mb-6 text-center">
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
            className="flex items-center space-x-4 p-5 rounded-lg border-2 border-border bg-muted/30 hover:bg-muted/50 hover:border-primary transition-all cursor-pointer group data-[selected=true]:border-primary data-[selected=true]:bg-muted/70"
            data-selected={value === option.value}
          >
            <RadioGroupItem 
              value={option.value} 
              id={option.value}
              className="border-border group-hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary shrink-0 size-5"
            />
            <Label
              htmlFor={option.value}
              className="text-lg font-medium text-foreground cursor-pointer flex-1 leading-relaxed group-hover:text-primary transition-colors"
            >
              {option.label}
            </Label>
          </div>
        ))}
        </RadioGroup>
      </fieldset>
    </div>
  );
}

