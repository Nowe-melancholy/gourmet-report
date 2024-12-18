import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';
import { ReportModel } from 'server/domain/report';

export class ReportRepository {
  private constructor(db: D1Database) {
    const adapter = new PrismaD1(db);
    this.prismaClient = new PrismaClient({ adapter });
  }

  private readonly prismaClient: PrismaClient;

  static create(db: D1Database) {
    return new ReportRepository(db);
  }

  findAll = async () => {
    const data = await this.prismaClient.report.findMany();

    return data.map((r) =>
      ReportModel.create({
        id: r.id,
        name: r.name,
        rating: r.rating,
        comment: r.comment,
        link: r.link,
        imgUrl: r.imgUrl,
        dateYYYYMMDD: r.dateYYYYMMDD,
        userId: r.userId,
      })
    );
  };

  findById = async (id: string) => {
    const data = await this.prismaClient.report.findUnique({
      where: {
        id,
      },
    });

    if (!data) {
      return null;
    }

    return ReportModel.create({
      id: data.id,
      name: data.name,
      rating: data.rating,
      comment: data.comment,
      link: data.link,
      imgUrl: data.imgUrl,
      dateYYYYMMDD: data.dateYYYYMMDD,
      userId: data.userId,
    });
  };

  create = async (report: ReportModel) => {
    await this.prismaClient.report.create({
      data: {
        id: report.id,
        name: report.name,
        rating: report.rating,
        comment: report.comment,
        link: report.link,
        imgUrl: report.imgUrl,
        dateYYYYMMDD: report.dateYYYYMMDD,
        userId: report.userId,
      },
    });

    return;
  };

  update = async (report: ReportModel) => {
    await this.prismaClient.report.update({
      where: {
        id: report.id,
      },
      data: {
        name: report.name,
        rating: report.rating,
        comment: report.comment,
        link: report.link,
        imgUrl: report.imgUrl,
        dateYYYYMMDD: report.dateYYYYMMDD,
        userId: report.userId,
      },
    });

    return;
  };

  delete = async (id: string) => {
    const deleted = await this.prismaClient.report.delete({
      where: {
        id,
      },
    });

    return deleted;
  };
}
