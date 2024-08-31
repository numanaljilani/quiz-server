import { Request } from "express"

export interface Login{
    email : string , password :string , FCMToken : string
}
export interface Payload{
    id : string
}

export interface MiddlewareInterface extends Request {
    user: Payload // or any other type
  }