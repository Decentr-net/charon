import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Decentr, LikeWeight, Post, Wallet } from 'decentr-js';

import { ConfigService } from '@shared/services/configuration';
import { PostsListFilterOptions, PostsListResponse } from './posts-api.definitions';
import { removeEmptyValues } from '@shared/utils/object';
import { PostsListItem } from '@core/services';

@Injectable()
export class PostsApiService {
  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient,
  ) {
  }

  public getPost(params: Pick<Post, 'owner' | 'uuid'>): Observable<PostsListItem> {
    return this.configService.getTheseusUrl().pipe(
      mergeMap((theseusApi) => {
        return this.httpClient.get<PostsListItem>(`${theseusApi}/v1/posts/${params.owner}/${params.uuid}`);
      }),
    );
  }

  public getPosts(filterOptions?: PostsListFilterOptions): Observable<PostsListResponse> {
    return this.configService.getTheseusUrl().pipe(
      mergeMap((theseusApi) => {
        return this.httpClient.get<PostsListResponse>(`${theseusApi}/v1/posts`, {
          params: removeEmptyValues(filterOptions) as Record<string, string>,
        });
      }),
    );
  }

  public getLikedPosts(
    api: string,
    walletAddress: Wallet['address'],
  ): Observable<Record<Post['uuid'], LikeWeight.Down | LikeWeight.Up>> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.community.getLikedPosts(walletAddress)),
    );
  }

  private createDecentrConnector(api: string): Observable<Decentr> {
    return this.configService.getChainId().pipe(
      map((chainId) => new Decentr(api, chainId)),
    );
  }
}
