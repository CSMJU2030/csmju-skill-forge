import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CareerPathsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.careerPath.findMany({
      include: { skills: { include: { skill: true } } },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.careerPath.findUnique({
      where: { id },
      include: { skills: { include: { skill: true } } },
    });
  }
}
