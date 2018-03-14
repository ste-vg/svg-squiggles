// declare variables defined by webpack from package.json

declare var VERSION:string;

interface Package
{   
    version: string
}

export function Pkg():Package
{
    return { version: VERSION }
}

