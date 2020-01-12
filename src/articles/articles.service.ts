import { ArticleDocument, ArticleModel } from '@mallowigi/articles/src/articles/articleModel';
import {
  commentsNatsClient,
  CreateArticleRequest,
  CreateArticleResponse,
  GetArticleRequest,
  IArticlesService,
  ListArticlesRequest,
  logger,
  RemoveArticleRequest,
  RemoveArticleResponse,
  UpdateArticleRequest,
  UpdateArticleResponse,
}                                        from '@mallowigi/common';
import { Injectable }                    from '@nestjs/common';
import { Client, ClientProxy }           from '@nestjs/microservices';
import { from, Observable }              from 'rxjs';

const defaultParams = {
  query:      {},
  pagination: {
    limit: 10,
    page:  1,
  },
};

@Injectable()
export class ArticlesService implements IArticlesService {
  @Client(commentsNatsClient)
  client: ClientProxy;

  async onModuleInit() {
    await this.client.connect();
  }

  public async list(req: ListArticlesRequest): Promise<Observable<ArticleDocument>> {
    const { query, pagination } = (
      req || defaultParams
    );

    try {
      const response = await ArticleModel.paginate(query, pagination);
      return from(response.docs as ArticleDocument[]);
    }
    catch (error) {
      const message = 'could not fetch articles';
      logger.error({
        message,
        payload: { query, pagination },
      });
      throw Error(message);
    }
  }

  public async create(req: CreateArticleRequest): Promise<CreateArticleResponse<ArticleDocument>> {
    const { authorId, content, title } = req;

    try {
      const article = new ArticleModel({ authorId, content, title });
      await article.save();

      return { article };
    }
    catch (error) {
      const message = 'could not create article';
      logger.error({
        error,
        message,
        payload: { authorId, content, title },
      });
      throw Error(message);
    }
  }

  public async get({ id }: GetArticleRequest): Promise<ArticleDocument> {
    try {
      return await ArticleModel.findOne({ _id: id });
    }
    catch (e) {
      const message = 'could not get article';
      logger.error({
        message,
        payload: { id },
      });
      throw Error(message);
    }
  }

  public async remove({ id }: RemoveArticleRequest): Promise<RemoveArticleResponse<ArticleDocument>> {
    try {
      const query = { _id: id };
      const article = await ArticleModel.findOne(query);
      article.remove();

      // Publish the event asynchronously
      await this.client.emit('ArticleDeletedEvent', { id }).toPromise();

      return {
        article,
        ok: true,
      };
    }
    catch (e) {
      const message = 'could not remove article';
      logger.error({
        message,
        payload: { id },
      });
      throw Error(message);
    }

  }

  public async update({ content, id, title }: UpdateArticleRequest): Promise<UpdateArticleResponse<ArticleDocument>> {
    try {
      const query = { _id: id };
      const article = await ArticleModel.findOne(query);

      await ArticleModel.findOneAndUpdate(query, { content, title });

      return { article };
    }
    catch (e) {
      const message = 'could not update article';
      logger.error({
        message,
        payload: { id },
      });
      throw Error(message);
    }
  }
}
