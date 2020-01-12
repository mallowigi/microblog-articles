import { connect }                                                  from 'mongoose';
import * as mongoosePaginate                                        from 'mongoose-paginate';
import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

connect(`${MONGODB_URL}/articles`, { useNewUrlParser: true });

const ArticleSchema = createSchema({
  title:    Type.string({ required: true }),
  content:  Type.string({ required: true }),
  authorId: Type.string({ required: true }),
});

ArticleSchema.plugin(mongoosePaginate);

// Exports
export type ArticleDocument = ExtractDoc<typeof ArticleSchema>;
export type ArticleProps = ExtractProps<typeof ArticleSchema>;
export const ArticleModel = typedModel('Article', ArticleSchema);
