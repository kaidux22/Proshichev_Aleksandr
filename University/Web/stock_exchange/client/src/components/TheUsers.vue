<template>
    <TheSearcher @output="GetUsers($event.target.value)"/>
    <ul>
        <li v-for="user of users" v-bind:key="user.id" v-bind:id="user.id" @click="(event)=>{ChangePage(event)}">
            <h3>{{ user.last_name }} {{ user.name }}</h3>
        </li>
    </ul>
</template>

<script>
import axios from 'axios'
import TheSearcher from '@/components/TheSearcher.vue'
export default{
    components: {
        TheSearcher
    },

    data(){
        return {
            users : []
        }
    },

    mounted() {
        this.GetUsers('')
    },

    methods: {
        ChangePage(event){
            window.scrollTo(0, 0)
            window.location.href = 'http://localhost:8080/#/user/' + event.target.id
        },

        Output(value){
            console.log(value)
        },

        GetUsers(input){
            axios.post('http://localhost:4200/api/users/', {input : input}).then((res) => { this.users = res.data })
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

    li:hover{
        background-color: #e0dfdf;
        cursor: pointer;
    }
</style>