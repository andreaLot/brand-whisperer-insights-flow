
import { CategoryService } from './CategoryService';
import { BrandService } from './BrandService';
import { WebhookService } from './WebhookService';
import { ApifyService } from './ApifyService';

// Re-export all types
export type {
  BusinessCategory,
  PlatformResult,
  AnalysisResult,
  ApifyBusinessResult,
  ApifyCategoryResult
} from './types';

export type { WebhookResponse } from './WebhookService';

// Combine all services into the main AnalysisService
export const AnalysisService = {
  detectCategory: CategoryService.detectCategory,
  analyzeBrand: BrandService.analyzeBrand,
  sendWebhookData: WebhookService.sendWebhookData,
  fetchBusinessFromApify: ApifyService.fetchBusinessFromApify,
  fetchCategoryFromApify: ApifyService.fetchCategoryFromApify,
  pollApifyRunStatus: ApifyService.pollApifyRunStatus
};
