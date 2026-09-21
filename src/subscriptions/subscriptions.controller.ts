import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Suscribir un tenant a un plan' })
  @ApiCreatedResponse({
    description:
      'Suscripción creada con estado ACTIVE y un período de facturación de 30 días.',
  })
  @ApiNotFoundResponse({ description: 'El plan indicado no existe.' })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar las suscripciones de un tenant' })
  @ApiQuery({
    name: 'tenantId',
    format: 'uuid',
    required: true,
    description: 'Tenant cuyas suscripciones se quieren consultar',
  })
  @ApiOkResponse({
    description:
      'Suscripciones del tenant, de la más reciente a la más antigua, con su plan asociado.',
  })
  findByTenant(@Query('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.subscriptionsService.findByTenant(tenantId);
  }
}
