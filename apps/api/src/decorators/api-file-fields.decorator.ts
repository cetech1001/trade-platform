import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import path from 'path';
import { environment } from '../../environments/environment';

export function ApiFiles(
  uploadFields: string[],
  requiredFields: string[] = [],
  otherProperties = {}
) {
  return applyDecorators(
    UseInterceptors(
      AnyFilesInterceptor({
        storage: diskStorage({
          destination: path.join(environment.assetsPath, 'uploads'),
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split('/')[1]}`,
            );
          },
        }),
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: requiredFields,
        properties: uploadFields.reduce((acc, field) => {
          acc[field] = { type: 'string', format: 'binary' };
          return acc;
        }, { ...otherProperties }),
      },
    }),
  );
}
