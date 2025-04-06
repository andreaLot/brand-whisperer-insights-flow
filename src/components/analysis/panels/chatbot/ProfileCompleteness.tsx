
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ApifyBusinessResult } from '@/services/types';

interface ProfileCompletenessProps {
  apifyBusinessResult: ApifyBusinessResult | null | undefined;
}

const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({ apifyBusinessResult }) => {
  const [completenessScore, setCompletenessScore] = useState(0);
  const [scoreDetails, setScoreDetails] = useState<Array<{field: string, present: boolean}>>([]);
  
  useEffect(() => {
    if (apifyBusinessResult) {
      // Fields to check for completeness
      const fieldsToCheck = [
        { field: 'Name', present: !!apifyBusinessResult.name },
        { field: 'Address', present: !!apifyBusinessResult.address },
        { field: 'Category', present: !!apifyBusinessResult.category },
        { field: 'Website', present: !!apifyBusinessResult.website },
        // We don't have phone or claim status in our current data
        // So we'll set default values
        { field: 'Phone Number', present: false },
        { field: 'Claim Status', present: false },
      ];
      
      // Calculate score (each field is worth ~16.67 points)
      const totalFields = fieldsToCheck.length;
      const presentFields = fieldsToCheck.filter(item => item.present).length;
      const calculatedScore = Math.round((presentFields / totalFields) * 100);
      
      setScoreDetails(fieldsToCheck);
      setCompletenessScore(calculatedScore);
    }
  }, [apifyBusinessResult]);
  
  if (!apifyBusinessResult) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Google Profile Completeness</h3>
        <span className="text-lg font-bold">{completenessScore}%</span>
      </div>
      
      <Progress value={completenessScore} className="h-2" />
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {scoreDetails.map((detail) => (
          <div key={detail.field} className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${detail.present ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className={detail.present ? 'text-white' : 'text-gray-400'}>
              {detail.field}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCompleteness;
