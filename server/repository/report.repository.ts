import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';
import { Report } from 'server/domain/report';

export class ReportRepository {
  private constructor(db: D1Database) {
    const adapter = new PrismaD1(db);
    this.prismaClient = new PrismaClient({ adapter });
  }

  private readonly prismaClient: PrismaClient;

  static create(db: D1Database) {
    return new ReportRepository(db);
  }

  async findAll() {
    const data = await this.prismaClient.report.findMany();
    return data.map(
      (r) =>
        new Report(r.id, r.name, r.rating, r.link, r.imgUrl, r.dateYYYYMMDD)
    );
  }
}
