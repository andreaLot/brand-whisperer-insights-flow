
import { CategoryService } from './CategoryService';
import { BrandService } from './BrandService';
import { WebhookService } from './WebhookService';
import { apifyService } from './apify/ApifyService';

// Re-export all types
export type {
  BusinessCategory,
  PlatformResult,
  AnalysisResult,
  ApifyBusinessResult,
  ApifyCategoryResult,
  WebhookResponse
} from './types';

// Combine all services into the main AnalysisService
export const AnalysisService = {
  detectCategory: CategoryService.detectCategory,
  analyzeBrand: BrandService.analyzeBrand,
  sendWebhookData: WebhookService.sendWebhookData,
  fetchBusinessFromApify: apifyService.fetchBusinessFromApify.bind(apifyService),
  pollApifyRunStatus: apifyService.pollApifyRunStatus.bind(apifyService)
};
