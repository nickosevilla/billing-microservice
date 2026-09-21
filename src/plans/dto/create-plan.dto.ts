import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Nombre comercial del plan',
    example: 'Pro',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({
    description: 'Precio mensual del plan',
    example: 49.9,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Almacenamiento máximo incluido, en MB',
    example: 10240,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  maxStorage: number;

  @ApiProperty({
    description: 'Ejecuciones máximas permitidas por período',
    example: 100000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  maxExecutions: number;
}
