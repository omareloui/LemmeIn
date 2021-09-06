// deno-lint-ignore-file
type Doc = Record<string, any>;

export class BaseService {
  public static create?: (data: any) => Promise<any>;
  public static createForMe?: (data: any, userId: string) => Promise<string>;
  public static getOneMine?: (id: string, userId: string) => Promise<Doc>;
  public static getAllMine?: (userId: string) => Promise<Doc[]>;
  public static removeOneMine?: (id: string, userId: string) => Promise<number>;
  public static updateOneMine?: (
    id: string,
    data: any,
    userId: string
  ) => Promise<Doc>;
}
