import * as express from 'express';
import { nameList } from './name.list';
import { UsersServices } from './users';

export function init(app: express.Application) { 
    nameList(app);
    UsersServices(app);
}
