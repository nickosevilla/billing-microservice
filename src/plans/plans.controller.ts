import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo plan' })
  @ApiCreatedResponse({ description: 'El plan fue creado correctamente.' })
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los planes' })
  @ApiOkResponse({ description: 'Listado de planes ordenado por fecha de creación.' })
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un plan por su identificador' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'El plan solicitado.' })
  @ApiNotFoundResponse({ description: 'No existe un plan con ese id.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente un plan' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'El plan actualizado.' })
  @ApiNotFoundResponse({ description: 'No existe un plan con ese id.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un plan' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'El plan fue eliminado.' })
  @ApiNotFoundResponse({ description: 'No existe un plan con ese id.' })
  @ApiConflictResponse({
    description: 'El plan tiene suscripciones asociadas y no puede eliminarse.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.plansService.remove(id);
  }
}
