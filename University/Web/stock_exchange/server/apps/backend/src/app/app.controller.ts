import { Controller, Get, Post, Req, Res} from '@nestjs/common';
import { IStock, IUser } from './interfaces';
import { SocketIO } from './socket.service';
import { readFileSync, writeFileSync } from 'fs';
import { reverse } from 'dns';

@Controller('')
export class AppController {
  data_url : string = '/home/kaidux22/Desktop/git_work/Proshichev_Aleksandr/University/Web/stock_exchange/data'
  sales : boolean = false
  stock : any = { stock : [] }
  index : number = 0
  interval : any 
  constructor(private readonly socket: SocketIO) {}

  @Post('users')
  GetUsers(@Req() req : Request) : IUser[]{
    let users = JSON.parse(readFileSync(this.data_url + '/users.json', 'utf8'))
    if(req.body["input"] == ''){
      
      return users.users
    }
    else{
      let data = []
      for(let user of users.users){
        let string = user.last_name + ' ' + user.name 
        if(string.indexOf(req.body['input']) != -1){
          data.push(user)
        }
      }
      return data
    }
  }

  @Post('user')
  GetUser(@Req() req : Request) : IUser{
    let users = JSON.parse(readFileSync(this.data_url + '/users.json', 'utf8'))
    return users.users[Number(req.body['id'])]
  }


  @Post('users/chng')
  ChangeUser(@Req() req : Request) : void {
    let users = JSON.parse(readFileSync(this.data_url + '/users.json', 'utf8'))
    let user : IUser = JSON.parse(req.body['user'])
    users.users[user.id] = user
    
    writeFileSync(this.data_url + '/users.json', JSON.stringify(users))
  }

  @Post('users/add')
  AddUser(@Req() req : Request) : void{
    let users = JSON.parse(readFileSync(this.data_url + '/users.json', 'utf8'))


    users.users.push(req.body)

    writeFileSync(this.data_url + '/users.json', JSON.stringify(users))
  }

  @Post('stock')
  GetStock(@Req() req : Request) : IStock[]{
    let stock = JSON.parse(readFileSync(this.data_url + '/stock.json', 'utf8'))
    if(req.body['input'] == ''){
      
      return stock.stock
    }
    else{
      let data = []
      for(let one_stock of stock.stock){
        let string = one_stock.symbol + ' ' + one_stock.company 
        if(string.indexOf(req.body['input']) != -1){
          data.push(one_stock)
        }
      }
      return data
    }
  }

  @Post('stock/graph')
  GetStockGraph(@Req() req : Request) : any{
    return JSON.parse(readFileSync(this.data_url + '/companies/' + req.body['input'] + '.json', 'utf8'))
  }

  @Get('sale')
  GetSalesStock(@Req() req : Request) : any{
    return this.sales
  }

  @Post('sale/start')
  StartSale(@Req() req : Request) : any{
    this.sales = true
    
    for(let symb of req.body['stock']){
      let data = JSON.parse(readFileSync(this.data_url + '/companies/' + symb + '.json', 'utf8'))
      let json = {type : symb, dates : [], prices : [], index : this.index}

      
      for(let pair of data.data){
        json.dates.push(pair.date)
        json.prices.push(pair.price)
      }

      let idx = json.dates.indexOf(req.body['date'])
      if(idx != -1){
        //
      }
      else{
        let [month, day, year] = req.body['date'].split('/').map((x : string) => Number(x))

        for(let i = 0; i <  json.dates.length; i++){
          let [cur_month, cur_day, cur_year] = json.dates[i].split('/').map((x : string) => Number(x))
          if(year < cur_year){
            continue
          }
          else if(month < cur_month){
            continue
          }
          else if(day < cur_day){
            continue
          }
          else{
            idx = i - 1
            break
          }
        }
        
      }


      json.dates.splice(idx)
      json.prices.splice(idx)

      json.dates = json.dates.reverse()
      json.prices = json.prices.reverse()

      this.stock.stock.push(json)
    }

    let self = this
    this.interval = setInterval(() => {
      self.index++

      let data = []
      for(let comp of self.stock.stock){
        if(self.index >= comp.dates.length){
          data.push(comp)
          continue
        }

        let dates_nw = []
        let prices_nw = []

        for(let i = 0; i < self.index; i++){
          dates_nw.push(comp.dates[i])
        }

        for(let i = 0; i < self.index; i++){
          prices_nw.push(comp.prices[i])
        }


        data.push({type : comp.type, dates : dates_nw, prices : prices_nw, index : self.index})
      }

      self.socket.BroadCast("data", {data : data})
    }, Number(req.body['insterval']) * 1000)

  }

  @Get('sale/stop')
  StopSale() : any{
    this.sales = false
    this.index = 0
    this.stock = { stock : [] }
    clearInterval(this.interval)
    this.socket.BroadCast("close", {})
  }
}
