import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

const BILLING_PERIOD_DAYS = 30;

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ tenantId, planId }: CreateSubscriptionDto) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });

    if (!plan) {
      throw new NotFoundException(`No existe un plan con el id ${planId}`);
    }

    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(currentPeriodStart);
    currentPeriodEnd.setUTCDate(
      currentPeriodEnd.getUTCDate() + BILLING_PERIOD_DAYS,
    );

    return this.prisma.subscription.create({
      data: {
        tenantId,
        planId,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart,
        currentPeriodEnd,
      },
    });
  }

  findByTenant(tenantId: string) {
    return this.prisma.subscription.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });
  }
}
