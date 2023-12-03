<template>
    <div class="header">
        <h1> АлексБибл :0)</h1>
        <p class="title">{{ PrintPath() }}</p>

        <div class="menu">
            <button v-bind:class="{chosen : this.$route.name == 'users' || this.$route.name == 'user'}" name="users" v-on:click="(event)=>{ChangePage(event)}">Брокер</button>
            <button v-bind:class="{chosen : this.$route.name == 'admin'}" name="admin" v-on:click="(event)=>{ChangePage(event)}">Администратор</button>
        </div>

        
    </div>
</template>

<script>
export default {
    methods: {
        PrintPath(){
            switch(this.$route.name){
                case "home":
                    return "Разделы"
                case "users":
                    return "Список брокеров"
                case "admin":
                    return "Администрирование"
                case "user":
                    return "Личный кабинет"
            }
        },

        ChangePage(event){
            window.location.href = 'http://localhost:8080/#/' + event.target.name
        }
    }
}
</script>

<style scoped>
    .header{
        width: 1850px;
        height: 100px;
        flex-shrink: 0;
        background: #ED5500;
    }

    h1{
        color: #FFF;
        font-family: JejuHallasan;
        font-size: 32px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        padding-left: 9px;
        margin-top: 0px;
        padding-top: 20px;
        margin-bottom: 0px;
    }
    p{
        color: #FFF;
        font-family: JejuHallasan;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin: 0px;
        padding-left: 9px;
        padding-bottom: 33px;
    }
    button{
        width: 197px;
        height: 40px;
        flex-shrink: 0;
        border-radius: 50px;
        font-size: 16px;
        font-family: JejuHallasan;
        border: 2px solid #F3F3F3;
        background: #F3F3F3;
        position: relative;
        bottom: 75px;
        left: 33%;
        margin-left: 40px;
        margin-right: 40px;
        text-align: center;
        background-position: 45px 7px;
        background-repeat: no-repeat;
        cursor: pointer;                
    }

    .chosen{
        background-color: #ED5500;
        color: white;
    }
</style>