// src\components\ui\NextStepCard.js
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard } from 'lucide-react';

const NextStepCard = ({ 
  title = "Ready for the next step?",
  description,
  buttonText,
  buttonHref,
  buttonVariant = "secondary",
  buttonSize = "lg",
  gradientFrom = "from-slate-900",
  gradientTo = "to-slate-800",
  borderColor = "border-slate-700",
  textColor = "text-white",
  buttonClassName = "bg-white text-slate-900 hover:bg-slate-100",
  showArrow = true,
  className = "",
  buttonIcon: ButtonIcon = ArrowRight,
  onButtonClick,
  disabled = false
}) => {
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  // Safe render for ButtonIcon - only render if it's a valid component
  const renderButtonIcon = () => {
    if (!showArrow) return null;
    if (!ButtonIcon || typeof ButtonIcon !== 'function') return null;
    return <ButtonIcon className="w-4 h-4 ml-2" />;
  };

  return (
    <Card className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} ${borderColor} ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${textColor} mb-2`}>
              {title}
            </h3>
            <p className={`${textColor.replace('text-white', 'text-slate-200')} opacity-90`}>
              {description}
            </p>
          </div>
          
          {buttonHref ? (
            <Link href={buttonHref} className="flex-shrink-0">
              <Button 
                variant={buttonVariant}
                size={buttonSize}
                className={`${buttonClassName} transition-all duration-200 hover:scale-105`}
                disabled={disabled}
              >
                {buttonText}
                {renderButtonIcon()}
              </Button>
            </Link>
          ) : (
            <Button 
              variant={buttonVariant}
              size={buttonSize}
              className={`${buttonClassName} transition-all duration-200 hover:scale-105 flex-shrink-0`}
              onClick={handleClick}
              disabled={disabled}
            >
              {buttonText}
              {renderButtonIcon()}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NextStepCard;