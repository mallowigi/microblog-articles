import { GrpcMethod }                  from '@mallowigi/articles/node_modules/@nestjs/microservices';
import { Observable }                  from '@mallowigi/articles/node_modules/rxjs';
import { ArticlesService }             from '@mallowigi/articles/src/articles/articles.service';
import { LoggingInterceptor }          from '@mallowigi/articles/src/logging.interceptor';
import {
  CreateArticleRequest,
  CreateArticleResponse,
  GetArticleRequest,
  IArticle,
  ListArticlesRequest,
  RemoveArticleRequest,
  RemoveArticleResponse,
  UpdateArticleRequest,
  UpdateArticleResponse,
}                                      from '@mallowigi/common';
import { Controller, UseInterceptors } from '@nestjs/common';

@UseInterceptors(LoggingInterceptor)
@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {
  }

  @GrpcMethod('ArticlesService')
  async list(req: ListArticlesRequest): Promise<Observable<IArticle>> {
    return await this.articlesService.list(req);
  }

  @GrpcMethod('ArticlesService')
  async get(req: GetArticleRequest): Promise<IArticle> {
    return await this.articlesService.get(req);
  }

  @GrpcMethod('ArticlesService')
  async create(req: CreateArticleRequest): Promise<CreateArticleResponse<IArticle>> {
    return await this.articlesService.create(req);
  }

  @GrpcMethod('ArticlesService')
  async update(req: UpdateArticleRequest): Promise<UpdateArticleResponse<IArticle>> {
    return await this.articlesService.update(req);
  }

  @GrpcMethod('ArticlesService')
  async remove(req: RemoveArticleRequest): Promise<RemoveArticleResponse<IArticle>> {
    return await this.articlesService.remove(req);
  }

}
