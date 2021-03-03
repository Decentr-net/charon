import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Post, Wallet } from 'decentr-js';

import { ConfigService } from '@shared/services/configuration';
import { removeEmptyValues } from '@shared/utils/object';
import { PostResponse, PostsListFilterOptions, PostsListResponse } from './posts-api.definitions';

@Injectable()
export class PostsApiService {
  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient,
  ) {
  }

  public getPost(params: Pick<Post, 'owner' | 'uuid'>, requestedBy: Wallet['address']): Observable<PostResponse> {
    return this.configService.getTheseusUrl().pipe(
      mergeMap((theseusApi) => {
        return this.httpClient.get<PostResponse>(`${theseusApi}/v1/posts/${params.owner}/${params.uuid}`, {
          params: { requestedBy },
        });
      }),
    );
  }

  public getPosts(filterOptions?: PostsListFilterOptions): Observable<PostsListResponse> {
    return this.configService.getTheseusUrl().pipe(
      mergeMap((theseusApi) => {
        return this.httpClient.get<PostsListResponse>(`${theseusApi}/v1/posts`, {
          params: removeEmptyValues(filterOptions) as unknown as Record<string, string>,
        });
      }),
    );
  }
}
