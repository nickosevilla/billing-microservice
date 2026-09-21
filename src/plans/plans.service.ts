import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlanDto: CreatePlanDto) {
    return this.prisma.plan.create({ data: createPlanDto });
  }

  findAll() {
    return this.prisma.plan.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`No existe un plan con el id ${id}`);
    }

    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    await this.findOne(id);

    return this.prisma.plan.update({ where: { id }, data: updatePlanDto });
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      return await this.prisma.plan.delete({ where: { id } });
    } catch (error) {
      // El esquema declara onDelete: Restrict, así que Postgres rechaza el
      // borrado si el plan todavía tiene suscripciones asociadas.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'No se puede eliminar un plan con suscripciones asociadas',
        );
      }

      throw error;
    }
  }
}
