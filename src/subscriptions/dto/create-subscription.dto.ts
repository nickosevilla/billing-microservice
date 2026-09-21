import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Identificador del tenant que se suscribe',
    format: 'uuid',
    example: '3f1c9d64-5c9a-4f4c-9a1e-2b7d8e0f4a11',
  })
  @IsUUID()
  tenantId: string;

  @ApiProperty({
    description: 'Identificador del plan al que se suscribe el tenant',
    format: 'uuid',
    example: '9b2e7c81-0d4a-4b3e-8f6c-1a5d3e9f7b22',
  })
  @IsUUID()
  planId: string;
}
