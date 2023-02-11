import { createParamDecorator, ExecutionContext} from "@nestjs/common";
import { InternalServerErrorException } from '@nestjs/common/exceptions';

export const GetUser = createParamDecorator((keys:string[],context:ExecutionContext)=>{
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if(!user){
        throw new InternalServerErrorException('User not found (request)');
    }
    return (keys && keys.length > 0) ?
           Object.keys(user).reduce((acum, key) => { if (keys.includes(key)) { acum[key] = user[key] }; return acum; }, {}) :
           user;
});