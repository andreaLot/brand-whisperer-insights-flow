
import React from 'react';
import { Search, MessageSquare, BarChart2, Shield, Sparkles } from "lucide-react";

interface PlatformIconProps {
  platform: string | undefined;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform }) => {
  const name = (platform || '').toLowerCase();
  
  if (name.includes('gemini')) return <Sparkles size={20} className="text-blue-400" />;
  if (name.includes('gpt') || name.includes('openai')) return <MessageSquare size={20} className="text-green-400" />;
  if (name.includes('perplexity')) return <Search size={20} className="text-purple-400" />;
  if (name.includes('deepseek')) return <Shield size={20} className="text-amber-400" />;
  if (name.includes('mistral')) return <BarChart2 size={20} className="text-red-400" />;
  
  return <Search size={20} className="text-gray-400" />;
};

export default PlatformIcon;
