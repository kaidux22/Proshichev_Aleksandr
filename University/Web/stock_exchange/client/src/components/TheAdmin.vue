<template>
    <div>
        <TheSearcher @output="GetUsers($event.target.value)"/>
        <ul>
            <li v-for="user of users" v-bind:key="user.id" v-bind:id="user.id" @click="ChangeIndex(user.id)" v-bind:class="{unchosen : this.index != user.id}">
                <h3>{{ user.last_name }} {{ user.name }}</h3>
                <div class="info" v-if="this.index == user.id">
                    <h3 class="title">Список имеющихся акций</h3>
                    <h3 v-if="user.stock && user.stock.length == 0" class="empty">Тут пока пусто</h3>
                    <ul v-else class="inner_ul">
                        <li v-for="stock of user.stock" v-bind:key="stock.type" class="inner">
                            <h2>{{ stock.type }} 
                                <i>{{ Math.floor(TakeDifference(stock)) + Math.floor(stock.sum) }}$</i> <i v-if="Diff(stock) != 0" v-bind:class="{high : Diff(stock) == 1, low : Diff(stock) == -1}">{{ Math.floor(TakeDifference(stock)) }}$</i>
                            </h2>
                            <h2 class="cnt"> Количество акций: {{ stock.cnt }} </h2>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <div class="createUser">
            <form @submit.prevent="Submit()">
                <input placeholder="Имя" v-model="this.nw_user.name">
                <input placeholder="Фамилия" v-model="this.nw_user.last_name">
                <input placeholder="Баланс" type="number" class="sum" v-model="this.nw_user.sum">
                <button type="Submit">Создать</button>
            </form>
        </div>
    </div>
</template>

<script>
import TheSearcher from '@/components/TheSearcher.vue'
import axios from 'axios'
import socket from '@/socket'

export default{
    components : {
        TheSearcher
    },

    mounted(){
        this.GetUsers('')
        socket.on("data", (data) => {
            this.data = JSON.parse(data).data
            })

        socket.on("close", () => {
            this.data = []
        })
        
    },

    data(){
        return {
            users : [],
            data : [],
            index : -1,
            nw_user : {
                name : '',
                last_name : '',
                sum : 0,
                stock: [],
                id : -1
            }
        }
    },

    methods : {
        GetUsers(input){
            axios.post('http://localhost:4200/api/users/', {input : input}).then((res) => { this.users = res.data })
        },

        ChangeIndex(id){
            if(this.index == id){
                this.index = -1
            }
            else{
                this.index = id
            }
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
        },

        Submit(){
            this.nw_user.id = this.users.length

            let json = {
                name : this.nw_user.name,
                last_name : this.nw_user.last_name,
                sum : this.nw_user.sum,
                stock: [],
                id : this.users.length
            }

            this.users.push(json)

            axios.post('http://localhost:4200/api/users/add', json)

            this.nw_user.name = ''
            this.nw_user.sum = 0
            this.nw_user.last_name = ''
        }
    }
}
</script>

<style scoped>
ul{
        margin-left: 0px;
        list-style-type: none;
        padding: 0;
        margin-top: 0px;
    }

    li{
        width: 1850px;
        height: auto;
        flex-shrink: 0;
        border-bottom: 2px solid #000;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    h3{
        color: #000;
        width: 500px;
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

    .unchosen:hover{
        background-color: #e0dfdf;
        cursor: pointer;
    }

    .info{
        margin: 20px;
        margin-top: 30px;
        padding: 20px;
        background-color: #f1efef;
        width: 95%;
        height: auto;
        border-radius: 20px;
    }

    .inner_ul{
        background-color: #e0dfdf;
        width: 700px;
        height: auto;
        margin: 20px;
        margin-left: 500px;
        border-radius: 10px;
    }
    .inner{
        border-bottom: none;
        padding: 20px;
        padding-left: 50px;
    }

    .inner h2{
        width: 600px;
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

    .title{
        padding-left: 650px;
    }

    .empty{
        padding-left: 740px;
        color: grey
    }

    .createUser{
        background-color: #f1efef;
        width: 47%;
        height: auto;
        padding: 20px;
        position: relative;
        left: 25%;
        border-radius: 20px;
    }

    .createUser input{
        outline: none;
        margin: 10px;
        width: 250px;
        height: 30px;
        border-radius: 20px;
        font-family: JejuHallasan;
        padding-left: 10px;
    }
    .createUser input.sum{
        width: 150px;
    }
    .createUser button{
        outline: none;
        background-color: white;
        border-radius: 10px;
        margin: 10px;
        height: 30px;
        width: 90px;
    }

    .createUser button:active{
        background-color: rgb(235, 86, 0);
        color: white;
    }

</style>