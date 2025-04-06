
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, MapPin, Phone, Link, Tag, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { ApifyBusinessResult } from '@/services/types';
import { calculateProfileCompleteness, ProfileField } from '@/utils/profileCompleteness';

interface ProfileCompletenessPanelProps {
  apifyBusinessResult: ApifyBusinessResult | null;
}

const ProfileCompletenessPanel: React.FC<ProfileCompletenessPanelProps> = ({ apifyBusinessResult }) => {
  const completeness = calculateProfileCompleteness(apifyBusinessResult);
  
  // Get field icon
  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'name': return <Info className="h-4 w-4" />;
      case 'address': return <MapPin className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'website': return <Link className="h-4 w-4" />;
      case 'category': return <Tag className="h-4 w-4" />;
      case 'claimStatus': return <ShieldCheck className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };
  
  // Get human-readable field name
  const getFieldLabel = (fieldName: string) => {
    switch (fieldName) {
      case 'name': return 'Business Name';
      case 'address': return 'Address';
      case 'phone': return 'Phone Number';
      case 'website': return 'Website';
      case 'category': return 'Category';
      case 'claimStatus': return 'Claim Status';
      default: return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }
  };
  
  // Get score color class based on overall score
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        Google Business Profile Completeness
      </h3>
      
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold ${getScoreColorClass(completeness.overallScore)}`}>
          {completeness.overallScore}%
        </span>
        <Progress 
          value={completeness.overallScore} 
          className={`h-2 ${
            completeness.overallScore >= 80 
              ? 'bg-green-900' 
              : completeness.overallScore >= 60 
                ? 'bg-amber-900' 
                : 'bg-red-900'
          }`}
        />
      </div>
      
      <div className="grid gap-4">
        {completeness.fields.map((field) => (
          <Card key={field.name} className="p-3 flex justify-between items-center bg-brand-gray-dark border-gray-700">
            <div className="flex items-center gap-2">
              {getFieldIcon(field.name)}
              <span>{getFieldLabel(field.name)}</span>
              <Badge variant={field.importance === 'high' ? 'destructive' : field.importance === 'medium' ? 'default' : 'outline'}>
                {field.importance.charAt(0).toUpperCase() + field.importance.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center">
              {field.value && field.isComplete ? (
                <span className="text-sm text-gray-400 mr-2 max-w-[200px] truncate">{field.value}</span>
              ) : null}
              {field.isComplete ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {completeness.missingFields.length > 0 && (
        <div className="mt-4 bg-brand-black/50 p-4 rounded-lg border border-red-900/40">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h4 className="font-semibold">Missing Information</h4>
          </div>
          <p className="text-sm text-gray-400">
            Add the following information to improve your Google Business Profile:
          </p>
          <ul className="mt-2 pl-5 list-disc text-sm text-gray-300">
            {completeness.missingFields.map(field => (
              <li key={field}>{getFieldLabel(field)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletenessPanel;
