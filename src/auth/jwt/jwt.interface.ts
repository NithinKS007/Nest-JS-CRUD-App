export interface IJwtService {
  sign(data: any): any;
  verify(data: any): any;
  decode(data: any): any;
}
