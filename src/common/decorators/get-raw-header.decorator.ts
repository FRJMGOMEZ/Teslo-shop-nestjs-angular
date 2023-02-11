import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetRawHeaders = createParamDecorator((keys:string[], ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return (keys && keys.length > 0) ?  req.rawHeaders.filter((header)=> !!header.split(' ').find((key)=> keys.includes(key) ) ): req.rawHeaders;
});