import { Injectable } from '@angular/core';

import { MessageBus } from '@shared/message-bus';
import { MessageCode } from '@scripts/messages';
import { AppRoute as CharonAppRoute } from '@charon/app-route';
import { HubFeedRoute as CharonHubFeedRoute, HubRoute as CharonHubRoute } from '@charon/hub';
import { UserRoute as CharonUserRoute } from '@charon/user';

@Injectable()
export class NavigationService {
  private readonly messageBus = new MessageBus();

  public closeApp(): void {
    this.messageBus.sendMessage(MessageCode.ToolbarClose);
  }

  public openCharonHubMyWall(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.Hub,
      CharonHubRoute.Feed,
      CharonHubFeedRoute.MyWall,
    ]);
  }

  public openCharonHubOverview(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.Hub,
    ]);
  }

  public openCharonHubRecentNews(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.Hub,
      CharonHubRoute.Feed,
      CharonHubFeedRoute.Recent,
    ]);
  }

  public openCharonUserSettings(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.User,
      CharonUserRoute.Edit,
    ]);
  }
}
