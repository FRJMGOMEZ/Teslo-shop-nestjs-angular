export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    defaultLimit: +process.env.DEFAULT_PAGINATION_LIMIT || 10,
    hostApi:process.env.HOST_API || 'http://localhost:3000/api'
});