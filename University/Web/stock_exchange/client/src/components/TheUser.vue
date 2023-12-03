<template>
    <div class="stock">
        <div class="comp" v-for="one of this.data" v-bind:key="one.type" v-bind:id="one.type + '_div'">
            <div class="data">
                <h1>{{ one.type }} </h1>
                <i>Цена {{ one.prices[one.dates.length - 1] }}$</i>
            </div>
            <div class="sale">
                <p>В наличие: {{ StockAbsence(one) }}</p>
                <button v-bind:class="{unavail : this.user.sum < one.prices[one.dates.length - 1]}" @click="GetStock(one)">Купить</button>
                <button v-bind:class="{unavail : StockAbsence(one) == 0}" @click="SoldStock(one)">Продать</button>
            </div>
            <Graph :chartData="ParseData(one)" :options="chartOptions" />
        </div>
    </div>
    <div class="info">
        
        <h3>{{ this.user.last_name }} {{ this.user.name }}</h3>
        <h3>Баланс: {{ Math.floor(this.user.sum) }}$</h3>

        <h3 v-if="this.data.length != 0">{{ this.data[0].dates[this.data[0].dates.length - 1] }}</h3>
        <h3 v-else>Биржа закрыта</h3>
    </div>
    <div class="list">
        <h1>Список приобретённых акций</h1>
        <h3 v-if="this.user.stock && this.user.stock.length == 0">Тут пока пусто</h3>
        <ul v-else>
            <li v-for="stock of this.user.stock" v-bind:key="stock.type">
                <h2>{{ stock.type }} 
                    <i>{{ Math.floor(TakeDifference(stock)) + Math.floor(stock.sum) }}$</i> <i v-if="Diff(stock) != 0" v-bind:class="{high : Diff(stock) == 1, low : Diff(stock) == -1}">{{ Math.floor(TakeDifference(stock)) }}$</i>
                </h2>
                <h2 class="cnt"> Количество акций: {{ stock.cnt }} </h2>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';
import socket from '@/socket';
import Graph from '@/components/TheGraph.vue'

export default{
    data(){
        return{
            user : {},
            origin : socket,
            data : [],
            charts : [],

            chartData: {
                labels: [],
                datasets: [ { data: [] } ]
            },
            chartOptions: {
                responsive: true
            }
        }
    },

    components : { Graph },

    mounted(){
        axios.post('http://localhost:4200/api/user/', {id : this.$route.params.id}).then((res) => {
            this.user = res.data
        })

        socket.on("data", (data) => {
            this.data = JSON.parse(data).data
            })

        socket.on("close", () => {
            this.data = []
        })
    },

    methods : {
        ParseData(stock){
            return {
                labels: stock.dates,
                datasets: [ { data: stock.prices, label: stock.type, borderColor: 'rgb(235, 86, 0)' } ]
            }
        },

        StockAbsence(stock){
            for(let elem of this.user.stock){
                if(elem.type == stock.type){
                    return elem.cnt
                }
            }
            return 0
        },

        GetStock(stock){
            this.user.sum -= stock.prices[stock.dates.length - 1]
            for(let elem of this.user.stock){
                if(elem.type == stock.type){
                    elem.cnt++
                    elem.sum += stock.prices[stock.dates.length - 1]
                    axios.post('http://localhost:4200/api/users/chng', {user : JSON.stringify(this.user)})
                    return
                }
            }



            let json = {
                type : stock.type,
                sum : stock.prices[stock.dates.length - 1],
                cnt : 1
            }
            this.user.stock.push(json)
            axios.post('http://localhost:4200/api/users/chng', { user : JSON.stringify(this.user)})
        },

        SoldStock(stock){
            this.user.sum += stock.prices[stock.dates.length - 1]

            for(let i = 0; i < this.user.stock.length; i++){
                let elem = this.user.stock[i]
                if(elem.type == stock.type){
                    elem.cnt--
                    elem.sum = elem.cnt *  stock.prices[stock.dates.length - 1]

                    if(elem.cnt == 0){
                        this.user.stock.splice(i, 1)
                    }
                }
            }

            axios.post('http://localhost:4200/api/users/chng', { user : JSON.stringify(this.user)})
        },

        TakeDifference(stock){
            for(let elem of this.data){
                if(elem.type == stock.type){
                    return elem.prices[elem.dates.length - 1] * stock.cnt - stock.sum
                }
            }
            return false
        },

        Diff(stock){
            for(let elem of this.data){
                if(elem.type == stock.type && elem.prices[elem.dates.length - 1] * stock.cnt - stock.sum < 0){
                    return -1
                }
                else if(elem.type == stock.type) {
                    return 1
                }
            }
            return 0
        }
    }
}
</script>

<style scoped>
    .stock{
        width: auto;
        height: 100px;
        margin: 10px;
        float: left;
    }
    .info{
        width: auto;
        height: auto;
        float: right;
        margin: 10px;
        margin-right: 250px;
        padding: 10px;
        background-color: rgb(235, 86, 0);
        padding: 10px;
        border-radius: 20px;
    }

    .info h3{
        font-family: 'JejuHallasan';
        color: white;
        text-align: center;
        font-size: 20px;
    }

    .stock h1{
        color: #000;
        width: 200px;
        margin-top: 0;
        margin-bottom: 0;
        font-family: Inter;
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        pointer-events: none;
        padding-left: 20px;             
    }

    .stock i{
        color: grey;
        font-size: 20px;
        padding-left: 20px;
    }

    .stock .comp{
        width: 1000px;
        height: 400px;
        margin: 15px;
        padding: 10px;
        border-radius: 15px;
        background-color: #e9e8e8;

    }
    button{
        margin: 2px;
        outline: none;
        border-radius: 50px;
        padding: 5px;
        color: black;
        background-color: white;
        width: 150px;
        height: 30px;
        font-family: JejuHallasan;
        float: right;
        pointer-events: all;
    }

    button:active{
        background-color:rgb(235, 86, 0);
        color: white
    }
    button.unavail{
        color: #e9e8e8;
        pointer-events: none;
    }

    .sale p{
        margin: 2px;
        font-family: JejuHallasan;
        font-size: 22px;
        float: right;
    }

    .sale{
        width: 150px;
        height: 70px;
        float: right;
        padding: 5px;
    }

    .data{
        width: 500px;
        float: left;
    }

    .graph{
        position: absolute;
        width: 60%;
        height: 60%;
        left: 20%;
        bottom: 20%;
        background-color: #000000c2;
    }

    .list{
        background-color: yellow;
        width: 700px;
        height: auto;
        position: absolute;
        left: 60%;
        top: 35%;
        background-color: #e9e8e8;
        border-radius: 15px;
    }
    .list h3{
        font-size: 20px;
        text-align: center;
        color: grey;
    }

    .list h1{
        text-align: center;
        font-family: Inter;
    }

    li{
        list-style: none;
        text-align: left;
        padding: 30px;
    }

    .list h2 i{
        color: grey;
    }

    h2 i.low{
        color: red;
    }

    h2 i.high{
        color: rgb(0, 182, 0);
    }

    h2.cnt{
        text-align: right;
        font-size: 20px;
        
    }

</style>