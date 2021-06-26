import { ONE_SECOND } from '../../../../../shared/utils/date';

export const pingProxyServer = async (host: string, timeout: number = ONE_SECOND * 8): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(`http://${host}?${Date.now()}`, {
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  return response;
};
