
import { WebhookResponse } from './types';
import { WebhookService as WebhookServiceImpl } from './webhook/WebhookService';

export const WebhookService = {
  normalizeModelToPlatform: WebhookServiceImpl.normalizeModelToPlatform,
  sendWebhookData: WebhookServiceImpl.sendWebhookData
};

export { normalizeModelToPlatform } from './webhook/platformUtils';
