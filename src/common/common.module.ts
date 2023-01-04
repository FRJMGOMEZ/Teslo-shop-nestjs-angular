import { Module } from '@nestjs/common';
import { QueryRunnerService } from './query-runner.service';

@Module({
    providers:[QueryRunnerService],
    exports:[QueryRunnerService]
})
export class CommonModule {

}
