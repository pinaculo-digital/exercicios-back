import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function Doc(params: {
  name: string;
  description?: string;
  statusCode?: HttpStatus;
  response?: Function; // eslint-disable-line @typescript-eslint/ban-types
  isArray?: boolean;
  hasAuth?: boolean;
  isDeprecated?: boolean;
}) {
  const statusCode = params.statusCode ?? HttpStatus.OK;
  const hasAuth = params.hasAuth ?? true;
  const isDeprecated = params.isDeprecated ?? false;

  const decorators = [
    ApiOperation({
      summary: params.name,
      description: params.description,
      deprecated: isDeprecated,
    }),
    HttpCode(statusCode),
  ];

  if (hasAuth) {
    decorators.push(ApiBearerAuth());
  }

  // Se não for passado uma resposta, então a resposta será um objeto genérico
  if (!params.response) {
    decorators.push(
      ApiResponse({
        status: statusCode,
        schema: {
          properties: {
            statusCode: { type: 'number', example: statusCode },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso',
            },
            data: { type: 'any', example: null },
          },
        },
      }),
    );
    return applyDecorators(...decorators);
  }

  // Registra os modelos para que o Swagger consiga tratar
  decorators.push(
    ApiExtraModels(params.response),
    ApiResponse({
      status: statusCode,
      schema: {
        allOf: [
          {
            properties: {
              statusCode: { type: 'number', example: statusCode },
              message: {
                type: 'string',
                example: 'Operação realizada com sucesso',
              },
              data: params.isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(params.response) },
                  }
                : {
                    $ref: getSchemaPath(params.response),
                  },
            },
          },
        ],
      },
    }),
  );

  return applyDecorators(...decorators);
}
