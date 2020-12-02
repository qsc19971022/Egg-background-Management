// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportTest from '../../../app/service/Test';
import ExportOauth from '../../../app/service/oauth';
import ExportRights from '../../../app/service/rights';
import ExportRoleRights from '../../../app/service/roleRights';
import ExportRoles from '../../../app/service/roles';
import ExportUser from '../../../app/service/user';
import ExportUserRole from '../../../app/service/userRole';
import ExportUsers from '../../../app/service/users';

declare module 'egg' {
  interface IService {
    test: AutoInstanceType<typeof ExportTest>;
    oauth: AutoInstanceType<typeof ExportOauth>;
    rights: AutoInstanceType<typeof ExportRights>;
    roleRights: AutoInstanceType<typeof ExportRoleRights>;
    roles: AutoInstanceType<typeof ExportRoles>;
    user: AutoInstanceType<typeof ExportUser>;
    userRole: AutoInstanceType<typeof ExportUserRole>;
    users: AutoInstanceType<typeof ExportUsers>;
  }
}
