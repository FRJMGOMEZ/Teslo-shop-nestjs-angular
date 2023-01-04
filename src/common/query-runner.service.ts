import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";

@Injectable()
export class QueryRunnerService { 

    constructor(private readonly dataSource: DataSource){}

    async startQueryRunner() {
        const queryRunner = await this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async commitAndReleaseQueryRunner(queryRunner: QueryRunner) {
        await queryRunner.commitTransaction();
        await queryRunner.release();
    }

    async rollbackAndReleaseQueryRunner(queryRunner: QueryRunner) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
    }
    
}