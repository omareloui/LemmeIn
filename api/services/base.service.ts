// deno-lint-ignore-file
export class BaseService {
  public static create: (data: any, userId: string) => Promise<string>;
  public static getOneMine?: (id: string, userId: string) => Promise<any>;
  public static getAllMine?: (userId: string) => Promise<any[]>;
  public static removeOneMine?: (id: string, userId: string) => Promise<number>;
  public static updateOneMine?: (
    id: string,
    data: any,
    userId: string
  ) => Promise<string>;
}
