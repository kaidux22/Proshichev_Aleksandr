export interface IUser{
    id: number,
    role: string,
    name: string,
    lastName: string,
    quote: string,
    birthday: string,
    nativeCity: string,
    email: string, 
    status: string,
    friends: any,
    password: string
}

export interface INews{
    title: string,
    text: string,
    status: string,
    author: string,
    author_id: number,
    news_id: number
}

export interface IMsg{
    text : string,
    author : string,
    author_id : number 
}