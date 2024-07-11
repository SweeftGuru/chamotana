import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company, Country } from '@prisma/client';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  createCompany(@Body() Body : any): Promise<Company> {
    return this.companyService.createCompany( Body)
  }
  @Get(':country')
  getChinaCompanies(@Param('country') country : Country): Promise<Company[]> {
    return this.companyService.getChinaCompanies(country);
  }
  @Get('visitors/:companyId')
  increaseCompanyVistors(@Param('companyId') companyId : number): Promise<Company> {
    return this.companyService.increaseCompanyVisitors(+companyId);
  }
}
