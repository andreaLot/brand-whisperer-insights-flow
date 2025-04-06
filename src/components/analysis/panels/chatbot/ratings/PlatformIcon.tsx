
import React from 'react';
import { Search, MessageSquare, BarChart2, Shield, Sparkles } from "lucide-react";

interface PlatformIconProps {
  platform: string | undefined;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform }) => {
  const name = (platform || '').toLowerCase();
  
  if (name.includes('gemini')) return <Sparkles size={20} className="text-white" />;
  if (name.includes('gpt') || name.includes('openai')) return <MessageSquare size={20} className="text-white" />;
  if (name.includes('perplexity')) return <Search size={20} className="text-white" />;
  if (name.includes('deepseek')) return <Shield size={20} className="text-white" />;
  if (name.includes('mistral')) return <BarChart2 size={20} className="text-white" />;
  
  return <Search size={20} className="text-white" />;
};

export default PlatformIcon;
