// src/components/questionnaire/QuestionnaireStep.js
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuestionnaireStep({ question, value, onChange }) {
  const handleSingleChoice = (selectedValue) => {
    onChange(selectedValue);
  };

  const handleMultiChoice = (optionValue) => {
    const currentValues = Array.isArray(value) ? value : [];
    
    if (question.maxSelections && currentValues.length >= question.maxSelections && !currentValues.includes(optionValue)) {
      return;
    }
    
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(newValues);
  };

  const handleText = (textValue) => {
    onChange(textValue);
  };

  const renderSingleChoice = () => (
    <div className="grid gap-3 md:grid-cols-2">
      {question.options.map((option) => {
        const isSelected = value === option.value;
        
        return (
          <Card
            key={option.value}
            className={cn(
              "cursor-pointer transition-all duration-200 border-2 group",
              isSelected
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
            )}
            onClick={() => handleSingleChoice(option.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  isSelected ? "bg-blue-100" : "bg-slate-100"
                )}>
                  <div className={cn(
                    "text-lg font-medium",
                    isSelected ? "text-blue-600" : "text-slate-600"
                  )}>
                    {option.label.charAt(0)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn(
                      "font-semibold text-base",
                      isSelected ? "text-blue-900" : "text-slate-900"
                    )}>
                      {option.label}
                    </h3>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {option.description && (
                    <p className={cn(
                      "text-sm leading-relaxed",
                      isSelected ? "text-blue-700" : "text-slate-600"
                    )}>
                      {option.description}
                    </p>
                  )}
                  
                  {option.details && (
                    <p className={cn(
                      "text-xs mt-1",
                      isSelected ? "text-blue-600" : "text-slate-500"
                    )}>
                      {option.details}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderMultiChoice = () => {
    const selectedValues = Array.isArray(value) ? value : [];
    const maxReached = question.maxSelections && selectedValues.length >= question.maxSelections;
    
    return (
      <div className="space-y-4">
        {question.maxSelections && (
          <div className="text-center">
            <Badge variant={maxReached ? "destructive" : "secondary"} className="text-xs">
              {selectedValues.length}/{question.maxSelections} selected
              {maxReached && " - Maximum reached"}
            </Badge>
          </div>
        )}
        
        <div className="grid gap-3 md:grid-cols-2">
          {question.options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            const canSelect = !maxReached || isSelected;
            
            return (
              <Card
                key={option.value}
                className={cn(
                  "cursor-pointer transition-all duration-200 border",
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : canSelect
                    ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    : "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                )}
                onClick={() => canSelect && handleMultiChoice(option.value)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "border-slate-300"
                    )}>
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-medium text-sm",
                        isSelected ? "text-blue-900" : "text-slate-900"
                      )}>
                        {option.label}
                      </h3>
                      {option.description && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {selectedValues.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-600 font-medium">Selected:</span>
              {selectedValues.map((val) => {
                const option = question.options.find(opt => opt.value === val);
                return (
                  <Badge 
                    key={val} 
                    variant="secondary" 
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-200 text-xs"
                  >
                    {option?.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMultiChoice(val);
                      }}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <Check className="w-2.5 h-2.5" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTextarea = () => (
    <div className="max-w-3xl">
      <Textarea
        placeholder={question.placeholder}
        value={value || ''}
        onChange={(e) => handleText(e.target.value)}
        rows={4}
        className="resize-none border border-slate-300 bg-white text-slate-900 rounded-lg p-4 focus:border-blue-500 transition-colors text-sm"
      />
      <p className="text-xs text-slate-500 mt-2">
        Share any specific requirements or preferences
      </p>
    </div>
  );

  const renderTextInput = () => (
    <div className="max-w-2xl">
      <Input
        placeholder={question.placeholder}
        value={value || ''}
        onChange={(e) => handleText(e.target.value)}
        className="border border-slate-300 bg-white text-slate-900 rounded-lg p-3 focus:border-blue-500 transition-colors"
      />
    </div>
  );

  const renderNumberInput = () => (
    <div className="max-w-xs">
      <Input
        type="number"
        placeholder={question.placeholder}
        value={value || ''}
        onChange={(e) => handleText(e.target.value)}
        min={question.min}
        max={question.max}
        className="border border-slate-300 bg-white text-slate-900 rounded-lg p-3 focus:border-blue-500 transition-colors"
      />
    </div>
  );

  const renderBoolean = () => (
    <div className="flex gap-4">
      <Button
        variant={value === true ? "default" : "outline"}
        onClick={() => onChange(true)}
        className={cn(
          "px-6 py-3",
          value === true 
            ? "bg-blue-500 text-white border-blue-500" 
            : "border-slate-300 text-slate-700"
        )}
      >
        Yes
      </Button>
      <Button
        variant={value === false ? "default" : "outline"}
        onClick={() => onChange(false)}
        className={cn(
          "px-6 py-3",
          value === false 
            ? "bg-slate-500 text-white border-slate-500" 
            : "border-slate-300 text-slate-700"
        )}
      >
        No
      </Button>
    </div>
  );

  switch (question.type) {
    case 'single-choice':
      return renderSingleChoice();
    case 'multi-choice':
      return renderMultiChoice();
    case 'textarea':
      return renderTextarea();
    case 'text':
      return renderTextInput();
    case 'number':
      return renderNumberInput();
    case 'boolean':
      return renderBoolean();
    default:
      return (
        <div className="text-center text-slate-500 py-6 text-sm">
          Unsupported question type
        </div>
      );
  }
}