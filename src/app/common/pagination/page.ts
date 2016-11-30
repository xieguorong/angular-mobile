/**
 *  分页模型
 * @description :: 定义分页模型
 */

export class Page {

  public pageNo: number = 1
  public pageSize: number = 20
  public totalCount: number = -1
  public totalPages: number = 0
  public hasNextPage: boolean = false
  public hasPrePage: boolean = false
  public beginIndex: number = 0
  public endIndex: number = 0

}
