import { MessageBus } from '../../../../../../../shared/message-bus';
import { WebpageAPIMessageBusMap } from '../../../../background/webpage-api/message-bus-map';
import { WebpageAPIMessageCode } from '../../../../background/webpage-api/messages';
import { WebpageAPIRequestMessageCode, WebpageAPIRequestMessageMap } from '../../webpage-api-message-bus';

const messageBus = new MessageBus<WebpageAPIMessageBusMap>();

export const openPost = async (params: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode.OpenPost]): Promise<void> => {
  return messageBus.sendMessage(WebpageAPIMessageCode.OpenPost, params).then((response) => {
    if (response?.error) {
      throw response.error;
    }
  });
};
