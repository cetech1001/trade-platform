import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {diskStorage} from "multer";
import path from "path";

export function ApiFile(
  fieldName = 'file',
  requiredFields: string[] = [],
  otherProperties = {}
) {
  return applyDecorators(
    UseInterceptors(
        FileInterceptor(fieldName, {
          storage: diskStorage({
            destination: path.join(process.cwd(), 'apps', 'api', 'src', 'assets', 'uploads'),
            filename: (req, file, cb) => {
              const uniqueSuffix =
                  Date.now() + '-' + Math.round(Math.random() * 1e9);
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
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
          ...otherProperties,
        },
      },
    })
  );
}
