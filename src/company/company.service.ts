import { Injectable } from '@nestjs/common';
import { Company, Country, MethodType } from '@prisma/client';
import { PrismaService } from 'prisma/prismaService/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCompany(data: {
    name: string;
    website: string;
    delivery: number;
    services: Array<{
      country: Country;
      methods: Array<{
        method: MethodType;
        price: number;
        delay: number;
      }>;
    }>;
  }) {
    try {
        const company = await this.prismaService.company.create({
            data: {
                name: data.name,
                website: data.website,
                delivery: data.delivery,
            }
        });

        for (const service of data.services) {
            const createdService = await this.prismaService.service.create({
                data: {
                    companyId: company.id,
                    country : service.country
                }
            });

            for (const method of service.methods) {
                await this.prismaService.serviceMethod.create({
                    data: {
                        serviceId: createdService.id,
                        method: method.method,
                        price: method.price,
                        delay: method.delay,
                    }
                });
            }

        }

        return company;
    } catch (error) {
        // Handle the error appropriately
        console.error('Error creating company:', error);
        throw error;
    }
  }
 async getChinaCompanies(country : Country): Promise<Company[]> {
    try {
        return await this.prismaService.company.findMany({
            where: {
                services: {
                    some: {
                        country: country // Direct comparison to the enum value
                    },
                },
            },
            include: {
                services: {
                    include: {
                        methods: true,
                    },
                },
            },
        });
    } catch (error) {
        // Handle the error appropriately
        console.error('Error fetching companies with services from China:', error);
        throw error;
    }
}
async increaseCompanyVisitors(companyId : number){
    try {
       return  await this.prismaService.company.update({
            where: { id: companyId },
            data: { visitors: { increment: 1 } },
        });
    } catch (error) {
        // Handle the error appropriately
        console.error('Error increasing company visitors:', error);
        throw error;
    }
}
}

